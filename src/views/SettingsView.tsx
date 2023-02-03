import React, { CSSProperties } from 'react';
import { dbAccess } from '../DBAccess';
import { DB_TABLES } from '../constants';

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
const exportStyle: CSSProperties = {
    display: 'block'
}
const buttonStyle: CSSProperties = {
    marginBottom: '8px'
}
const clearButtonStyle: CSSProperties = {
    marginLeft: '8px',
    marginRight: '8px'
}
interface Props { }
interface State {
    showClearedTable: boolean
}

class SettingsView extends React.Component<Props, State> {
    private _selectedClearTable: string
    constructor(p: Props) {
        super(p)
        this.state = {
            showClearedTable: false
        }
        this._selectedClearTable = TABLES[0];
    }
    onClickExportTransactions = () => {
        console.log('exporting transactions csv')
        dbAccess.downloadTransactionsCSV()
    }
    onClickExportAssets = () => { }
    onClickExportExchanges = () => { }
    onClickExportPayments = () => { }
    onClickImport() {

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
    }

    private _clearTextTimeout: any = null
    showClearedText = () => {
        this.setState({ ...this.state, showClearedTable: true })
        this._clearTextTimeout = setTimeout(() => {
            this._clearTextTimeout = null
            this.setState({ ...this.state, showClearedTable: false })
        }, 1000)
    }

    render(): React.ReactNode {
        const clearTextStyle = this.state.showClearedTable ? {} : { display: 'none' }
        return <div id="settings" style={viewStyle}>
            <div id="settings.clearTable">
                <h5>Clear Table</h5>
                <select onChange={this.onSelectClearTableOption}>
                    {/* <option>Assets</option>
                    <option>Exchanges</option>
                    <option>Payments</option>
                    <option>Transactions</option> */}
                    {this.renderClearTableOptions()}
                </select>
                <button onClick={this.onClickClearTable} style={clearButtonStyle}>Clear</button>
                <span style={clearTextStyle}>Cleared {this._selectedClearTable} Table</span>
            </div>
            <div id="settings.export" style={exportStyle}>
                <h5>Export as CSV</h5>
                {/* <button onClick={this.onClickExport}>Export CSV</button> */}
                <button onClick={this.onClickExportTransactions} style={buttonStyle}>Transactions</button><br />
                <button style={buttonStyle} disabled>Assets</button><br />
                <button style={buttonStyle} disabled>Exchanges</button><br />
                <button style={buttonStyle} disabled>Payments</button><br />
            </div>
            <div id="settings.import">
                <h5>Import CSV file</h5>
                <button style={buttonStyle} onClick={this.onClickImport} disabled>Import CSV</button>
            </div>
        </div>
    }
}

export default SettingsView;