import React, { CSSProperties } from 'react';
import { dbAccess } from '../DBAccess';
import { KEYWORD_TYPES } from '../constants';
import LatestTransactionsView from './transactions/LatestTransactionsView';

interface Props { }
interface States {
    assets: string[],
    exchanges: string[],
    payments: string[],
    isLoaded: boolean
    selectedDate: string
    fromInputValid: boolean
    toInputValid: boolean
    showAddedTransaction: boolean
    fromInputText: string
    toInputText: string
}

const viewStyle: CSSProperties = {
    border: '1px solid',
    borderRadius: '8px',
    marginTop: '8px',
    padding: '8px'
}
const addNewStyle: CSSProperties = {
    border: '1px solid',
    borderRadius: '8px',
    marginTop: '8px',
    padding: '8px'
}
const unitSelectorStyle: CSSProperties = {
    marginRight: '8px'
}
const entryRowStyle: CSSProperties = {
    marginBottom: '8px',
}
const inputInvalidStyle: CSSProperties = {
    border: '1px solid red',
    borderRadius: '2px',
    color: 'red'
}
const transactionAddedStyle: CSSProperties = {
    marginLeft: '8px',
    color: 'green',
    border: '1px green',
    borderRadius: '8px'
}
/* Safari IOS 16.1.1
has problem with <input type="number"/>
where it returns input of "12." as empty string.
Doesn't happen on safari desktop and chrome/mobile
*/

class AddTransactionView extends React.Component<Props, States>{
    private _latestTransactionViewRef: React.RefObject<LatestTransactionsView> = React.createRef<LatestTransactionsView>();
    private _selectedFrom: string = '';
    private _selectedTo: string = '';
    private _selectedExchange: string = '';
    private _selectedPayment: string = '';

    constructor(p: Props) {
        super(p)

        const timeZoneOffSet = new Date().getTimezoneOffset();//-480 for GMT+8
        const targetDate = new Date(Date.now() - timeZoneOffSet * 60 * 1000);//in milliseconds and offset is in minutes

        //'2023-01-17T15:53:00.757Z' removes the part behind '.', as the accepted format is yyyy-MM-ddTHH:mm:ss
        const formatDate = targetDate.toISOString().split(".")[0]

        this.state = {
            assets: [],
            exchanges: [],
            payments: [],
            isLoaded: false,
            selectedDate: formatDate,
            fromInputValid: false,
            toInputValid: false,
            showAddedTransaction: false,
            fromInputText: '',
            toInputText: ''
        }
    }

    componentDidMount(): void {
        //fetch the 3 lists
        this.fetchLists();
    }

    fetchLists() {
        dbAccess.getList(KEYWORD_TYPES.ASSETS).then((assetsList) => {
            const assets = assetsList.map(e => e.name)
            this.setState({ ...this.state, assets })
            if (assets.length > 0) {
                this._selectedFrom = assets[0]
                this._selectedTo = assets[0]
            }
            return dbAccess.getList(KEYWORD_TYPES.EXCHANGES)
        }).then((exchangesList) => {
            const exchanges = exchangesList.map(e => e.name)
            this.setState(state => {
                return { ...state, exchanges }
            })
            if (exchanges.length > 0)
                this._selectedExchange = exchanges[0]
            return dbAccess.getList(KEYWORD_TYPES.PAYMENTS)
        }).then((paymentsList) => {
            const payments = paymentsList.map(e => e.name)
            this.setState((state) => {
                return { ...state, payments }
            })
            if (payments.length > 0)
                this._selectedPayment = payments[0]
            return true
        }).then(() => {
            this.setState(s => {
                return { ...s, isLoaded: true }
            })
        });
    }

    onSelectFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedID = e.target.selectedOptions[0].id
        this._selectedFrom = selectedID;
    }
    onSelectToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedID = e.target.selectedOptions[0].id
        console.log('selected to:', selectedID)
        this._selectedTo = selectedID;
    }
    onSelectExchangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedID = e.target.selectedOptions[0].id
        console.log('selected exchange:', selectedID)
        this._selectedExchange = selectedID;
    }
    onSelectPaymentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedID = e.target.selectedOptions[0].id
        console.log('selected payment:', selectedID)
        this._selectedPayment = selectedID;
    }
    private _fromAmount: number = 0
    private _toAmount: number = 0
    onFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('from amt change')
        const num = Number(e.target.value);//empty string = 0
        this._fromAmount = num
        const valid = num > 0
        this.setState({ ...this.state, fromInputValid: valid, fromInputText: e.target.value })
        console.log('fromAmount:', this._fromAmount)
    }
    onToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const num = Number(e.target.value);//empty string = 0
        this._toAmount = num
        const valid = num > 0
        this.setState({ ...this.state, toInputValid: valid, toInputText: e.target.value })
        console.log('toAmount:', this._toAmount)
    }

    renderFromView() {
        const options = this.state.assets.map(s => {
            return <option key={s} id={s}>{s}</option>
        })
        const targetStyle = this.state.fromInputValid ? {} : inputInvalidStyle
        return <div id='transactions.from' style={entryRowStyle}>
            <label>From : </label>
            <select onChange={this.onSelectFromChange} style={unitSelectorStyle}>
                {options}
            </select>
            <input type="text" placeholder='units' value={this.state.fromInputText} onChange={this.onFromAmountChange} style={targetStyle} />
        </div>
    }

    renderToView() {
        const options = this.state.assets.map(s => {
            return <option key={s} id={s}>{s}</option>
        })
        const targetStyle = this.state.toInputValid ? {} : inputInvalidStyle
        return <div id='transactions.to' style={entryRowStyle}>
            <label>To : </label>
            <select onChange={this.onSelectToChange} style={unitSelectorStyle}>
                {options}
            </select>
            <input type="text" placeholder='units' value={this.state.toInputText} onChange={this.onToAmountChange} style={targetStyle} />
        </div>
    }

    renderExchangeView() {
        const options = this.state.exchanges.map(s => {
            return <option key={s} id={s}>{s}</option>
        })
        return <div id='transactions.exchange' style={entryRowStyle}>
            <label>Exchange : </label>
            <select onChange={this.onSelectExchangeChange}>
                {options}
            </select>
        </div>
    }

    renderPaymentView() {
        const options = this.state.payments.map(s => {
            return <option key={s} id={s}>{s}</option>
        })
        return <div id='transactions.payment' style={entryRowStyle}>
            <label>Payment : </label>
            <select onChange={this.onSelectPaymentChange}>
                {options}
            </select>
        </div>
    }
    renderDateView() {
        return <div id="transactions.date" style={entryRowStyle}>
            <label>Date : </label>
            <input type="datetime-local"
                value={this.state.selectedDate}
                onChange={this.onDateChange} />
        </div>
    }

    onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('date change:', e.target.value)
        this.setState({ ...this.state, selectedDate: e.target.value })
    }

    onClickAddTransaction = () => {
        console.log('date:', this.state.selectedDate)
        console.log('from:', this._selectedFrom)
        console.log('fromAmount:', this._fromAmount)
        console.log('to:', this._selectedTo)
        console.log('toAmount:', this._toAmount)
        console.log('exchange:', this._selectedExchange)
        console.log('payment:', this._selectedPayment)
        if (this._selectedFrom === this._selectedTo) {
            console.error("unable to add when from same as to")
            alert("unable to add transaction. from is same as to")
            return;
        } else if (this._fromAmount <= 0 || this._toAmount <= 0) {
            console.error('unable to add when amount is less than or equals to 0')
            alert('unable to add when amount is less than or equals to 0')
            return;
        } else if (Number.isNaN(this._fromAmount)) {
            console.error('Invalid From Amount')
            alert('Invalid From Amount')
        } else if (Number.isNaN(this._toAmount)) {
            console.error('Invalid To Amount')
            alert('Invalid To Amount')
        }
        dbAccess.addTransaction(this.state.selectedDate,
            this._selectedFrom,
            this._fromAmount,
            this._selectedTo,
            this._toAmount,
            this._selectedExchange,
            this._selectedPayment
        ).then((rs) => {
            this.clearTextBoxes()
            this.showAddedTransaction()
        },
            (err) => {
                console.log('failed to add transaction')
            });
    }
    private _showTimeoutKey: any = null
    showAddedTransaction() {
        this.setState((state) => {
            return { ...state, showAddedTransaction: true }
        })
        this._showTimeoutKey = setTimeout(() => {
            this._showTimeoutKey = null
            this.setState((state) => {
                return { ...state, showAddedTransaction: false }
            })
            this._latestTransactionViewRef.current?.forceUpdateData()
        }, 1500);
    }
    clearTextBoxes() {
        this.setState((s) => {
            return { ...s, fromInputText: '', toInputText: '', toInputValid: false, fromInputValid: false }
        })
    }

    componentWillUnmount(): void {
        if (this._showTimeoutKey) {
            clearTimeout(this._showTimeoutKey)
        }
    }

    render() {
        if (!this.state.isLoaded)
            return <div>Loading keywords...</div>

        const confirmStyle = this.state.showAddedTransaction ? transactionAddedStyle : { display: 'none' }

        return <div id="transactions" style={viewStyle}>
            <div id="transactions.addNew" style={addNewStyle}>
                <h5>Add New</h5>
                <hr />
                {this.renderDateView()}
                {this.renderFromView()}
                {this.renderToView()}
                {this.renderExchangeView()}
                {this.renderPaymentView()}
                <button
                    onClick={this.onClickAddTransaction}
                    disabled={!(this.state.fromInputValid && this.state.toInputValid)}
                >Add Transaction</button>
                <span style={confirmStyle}>&#10003; Transaction Added</span>
            </div>
            <LatestTransactionsView ref={this._latestTransactionViewRef} />

        </div>
    }
}

export default AddTransactionView;
