import React, { CSSProperties } from 'react';
import { dbAccess } from '../DBAccess';
import { DB_TABLES, ERROR_MESSAGES, NON_TRANSACTION_FIELDS, TRANSACTION_FIELDS } from '../constants';

const TABLES = [
    DB_TABLES.ASSETS,
    DB_TABLES.EXCHANGES,
    DB_TABLES.PAYMENTS,
    DB_TABLES.TRANSACTIONS
]

const viewStyle: CSSProperties = {
    border: '1px solid',
    borderRadius: '8px',
    marginTop: '8px',
    padding: '8px'
}
const buttonListStyle: CSSProperties = {
    display: 'block'
}
const buttonStyle: CSSProperties = {
    marginBottom: '8px'
}
const clearButtonStyle: CSSProperties = {
    marginLeft: '8px',
    marginRight: '8px'
}
const warningTextStyle: CSSProperties = {
    fontWeight: 'bold',
    color: 'red',
    fontSize: '15px',
    margin: '0px',
    marginBottom: '8px'
}
interface Props { }
interface State {
    showClearedTable: boolean
    showImportSuccess: boolean
}

class SettingsView extends React.Component<Props, State> {
    private _clearTextTimeout: any = null
    private _importSuccessTimeout: any = null
    private _selectedClearTable: string
    constructor(p: Props) {
        super(p)
        this.state = {
            showClearedTable: false,
            showImportSuccess: false
        }
        this._selectedClearTable = TABLES[0];
    }

    onClickExportTransactions = () => {
        dbAccess.downloadCSVFor(DB_TABLES.TRANSACTIONS)
    }
    onClickExportAssets = () => {
        dbAccess.downloadCSVFor(DB_TABLES.ASSETS)
    }
    onClickExportExchanges = () => {
        dbAccess.downloadCSVFor(DB_TABLES.EXCHANGES)
    }
    onClickExportPayments = () => {
        dbAccess.downloadCSVFor(DB_TABLES.PAYMENTS)
    }
    private _selectCSVFile(): Promise<File> {
        return new Promise((rs, rj) => {
            const element = document.createElement('input')
            element.type = 'file'
            element.accept = 'text/csv'
            element.onchange = () => {
                console.log('files : ', element.files)
                if (element.files) {
                    const file = element.files[0]
                    rs(file)
                } else {
                    rj("didn't select any file")
                }
            }
            element.click()
        });
    }
    private _readFileAsString(f: File): Promise<string> {
        return new Promise((rs, rj) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                const str = e.target?.result as string
                rs(str)
            }
            reader.onerror = (e) => {
                rj(e)
            }
            reader.readAsText(f)
        });
    }
    private _matchCSVHeaders(csvString: string, headers: string[]): boolean {
        const headerLine: string = csvString.substring(0, csvString.indexOf('\n'))
        const checkHeaders = headerLine.split(',')

        if (checkHeaders.length !== headers.length)
            return false

        for (let i = 0; i < headers.length; i++) {
            if (!checkHeaders.includes(headers[i]))
                return false
        }
        return true
    }
    onClickImportTransactions = () => {
        this._selectCSVFile()
            .then(this._readFileAsString)
            .then((str) => {
                if (!this._matchCSVHeaders(str, TRANSACTION_FIELDS))
                    throw new Error(ERROR_MESSAGES.INCOMPAT_TRANSACTION_CSV)

                return dbAccess.importCSV(DB_TABLES.TRANSACTIONS, str)
            })
            .then(() => {
                this.showImportSuccess()
            }).catch((e) => {
                alert(e.message)
            })
    }
    onClickImportAssets = () => {
        this._selectCSVFile()
            .then(this._readFileAsString)
            .then((str) => {
                if (!this._matchCSVHeaders(str, NON_TRANSACTION_FIELDS))
                    throw new Error(ERROR_MESSAGES.INCOMPAT_NON_TRANSACTION_CSV)

                return dbAccess.importCSV(DB_TABLES.ASSETS, str)
            })
            .then(() => {
                this.showImportSuccess()
            }).catch((e) => {
                alert(e.message)
            })
    }
    onClickImportExchanges = () => {
        this._selectCSVFile()
            .then(this._readFileAsString)
            .then((str) => {
                if (!this._matchCSVHeaders(str, NON_TRANSACTION_FIELDS))
                    throw new Error(ERROR_MESSAGES.INCOMPAT_NON_TRANSACTION_CSV)
                return dbAccess.importCSV(DB_TABLES.EXCHANGES, str)
            })
            .then(() => {
                this.showImportSuccess()
            }).catch((e) => {
                alert(e.message)
            })
    }
    onClickImportPayments = () => {
        this._selectCSVFile()
            .then(this._readFileAsString)
            .then((str) => {
                if (!this._matchCSVHeaders(str, NON_TRANSACTION_FIELDS))
                    throw new Error(ERROR_MESSAGES.INCOMPAT_NON_TRANSACTION_CSV)
                return dbAccess.importCSV(DB_TABLES.PAYMENTS, str)
            })
            .then(() => {
                this.showImportSuccess()
            }).catch((e) => {
                alert(e.message)
            })
    }

    onSelectClearTableOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log('selected : ', e.target.selectedOptions[0].value)
        this._selectedClearTable = e.target.selectedOptions[0].value
    }
    onClickClearTable = () => {
        if (window.confirm(`Clear ${this._selectedClearTable} table?`)) {
            console.log('trying to clear table :', this._selectedClearTable)
            dbAccess.clearTable(this._selectedClearTable).then((success) => {
                this.showClearedText()
            })
        }
    }

    renderClearTableOptions() {
        return TABLES.map((e) => {
            return <option id={e} key={e}>{e}</option>
        })
    }

    componentWillUnmount(): void {
        if (this._clearTextTimeout) {
            clearTimeout(this._clearTextTimeout)
        }
        if (this._importSuccessTimeout) {
            clearTimeout(this._importSuccessTimeout)
        }
    }

    showClearedText = () => {
        this.setState({ ...this.state, showClearedTable: true })
        this._clearTextTimeout = setTimeout(() => {
            this._clearTextTimeout = null
            this.setState({ ...this.state, showClearedTable: false })
        }, 1000)
    }
    showImportSuccess = () => {
        this.setState({ ...this.state, showImportSuccess: true })
        this._importSuccessTimeout = setTimeout(() => {
            this._importSuccessTimeout = null;
            this.setState({ ...this.state, showImportSuccess: false })
        }, 1000)
    }

    render(): React.ReactNode {
        const clearTextStyle = this.state.showClearedTable ? {} : { display: 'none' }
        const importedTextStyle = this.state.showImportSuccess ? {} : { display: 'none' }
        return <div id="settings" style={viewStyle}>
            <div id="settings.clearTable">
                <h5>Clear Table</h5>
                <select onChange={this.onSelectClearTableOption}>
                    {this.renderClearTableOptions()}
                </select>
                <button onClick={this.onClickClearTable} style={clearButtonStyle}>Clear</button>
                <span style={clearTextStyle}>Cleared {this._selectedClearTable} Table</span>
            </div>
            <div id="settings.export" style={buttonListStyle}>
                <h5>Export as CSV</h5>
                <button onClick={this.onClickExportTransactions} style={buttonStyle}>Transactions</button>
                <br />
                <button onClick={this.onClickExportAssets} style={buttonStyle} >Assets</button>
                <br />
                <button onClick={this.onClickExportExchanges} style={buttonStyle} >Exchanges</button>
                <br />
                <button onClick={this.onClickExportPayments} style={buttonStyle} >Payments</button>
                <br />
            </div>
            <div id="settings.import" style={buttonListStyle}>
                <h5>Import CSV file <span style={importedTextStyle}> &#10003; Imported CSV</span></h5>
                <p style={warningTextStyle}>Clears then add entries from CSV. Process irreversable!</p>
                <p style={warningTextStyle}>Advised to export CSV for safekeeping before importing!</p>
                <button style={buttonStyle} onClick={this.onClickImportTransactions}>Transactions</button>
                <br />
                <button style={buttonStyle} onClick={this.onClickImportAssets}>Assets</button>
                <br />
                <button style={buttonStyle} onClick={this.onClickImportExchanges}>Exchanges</button>
                <br />
                <button style={buttonStyle} onClick={this.onClickImportPayments}>Payments</button>

                <br />
            </div>
        </div>
    }
}

export default SettingsView;