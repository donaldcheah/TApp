import React from 'react';
import { dbAccess } from '../DBAccess';
import { KEYWORD_TYPES } from '../constants';

interface Props { }
interface States {
    assets: string[],
    exchanges: string[],
    payments: string[],
    isLoaded: boolean
    selectedDate: string
}

class AddTransactionView extends React.Component<Props, States>{
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
            selectedDate: formatDate
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
            // console.log('s', this.state)
        });
    }

    onSelectFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedID = e.target.selectedOptions[0].id
        console.log('selected from:', selectedID)
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
        const num = Number(e.target.value);//empty string = 0
        if (num <= 0) {
            //found invalid 0 or negative number
            this._fromAmount = 0
            e.target.value = ''
            return;
        }
        this._fromAmount = num
        console.log('fromAmount:', this._fromAmount)
    }
    onToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const num = Number(e.target.value);//empty string = 0
        if (num <= 0) {
            //found invalid 0 or negative number
            this._toAmount = 0
            e.target.value = ''
            return;
        }
        this._toAmount = num
        console.log('toAmount:', this._toAmount)
    }

    renderFromView() {
        const options = this.state.assets.map(s => {
            return <option key={s} id={s}>{s}</option>
        })
        return <div>
            <label>From : </label>
            <select onChange={this.onSelectFromChange}>
                {options}
            </select>
            <input type="number" placeholder='units' onChange={this.onFromAmountChange} />
        </div>
    }

    renderToView() {
        const options = this.state.assets.map(s => {
            return <option key={s} id={s}>{s}</option>
        })
        return <div>
            <label>To : </label>
            <select onChange={this.onSelectToChange}>
                {options}
            </select>
            <input type="number" placeholder='units' onChange={this.onToAmountChange} />
        </div>
    }

    renderExchangeView() {
        const options = this.state.exchanges.map(s => {
            return <option key={s} id={s}>{s}</option>
        })
        return <div>
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
        return <div>
            <label>Payment : </label>
            <select onChange={this.onSelectPaymentChange}>
                {options}
            </select>
        </div>
    }
    renderDateView() {

        return <div>
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
        }
        dbAccess.addTransaction(this.state.selectedDate,
            this._selectedFrom,
            this._fromAmount,
            this._selectedTo,
            this._toAmount,
            this._selectedExchange,
            this._selectedPayment
        ).then((rs) => {
            console.log('added transaction')
        },
            (err) => {
                console.log('failed to add transaction')
            });
    }

    render() {
        if (!this.state.isLoaded)
            return <div>Loading keywords...</div>

        return <div>
            <p>in add transaction view</p>
            <div>
                {this.renderDateView()}
                {this.renderFromView()}
                {this.renderToView()}
                {this.renderExchangeView()}
                {this.renderPaymentView()}
                <button onClick={this.onClickAddTransaction}>Add Transaction</button>
            </div>
        </div>
    }
}

export default AddTransactionView;
