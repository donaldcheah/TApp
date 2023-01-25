import React from 'react';
import ReportNumTransactions from './reports/ReportNumTransactions';
import ReportAssetsSold from './reports/ReportAssetsSold';
import ReportCurrency from './reports/ReportCurrency';

import { dbAccess } from '../DBAccess';
import { KEYWORD_TYPES } from '../constants';

interface Props { }
interface States {
    exchanges: string[],
    payments: string[]
    filterMonth: string,
    filterYear: string,
    filterExchange: string,
    filterPayment: string,
    filteredTransactions: any[]
}

const MONTHS = {
    "Any": 0,
    "January": 1,
    "February": 2,
    "March": 3,
    "April": 4,
    "May": 5,
    "June": 6,
    "July": 7,
    "August": 8,
    "September": 9,
    "October": 10,
    "November": 11,
    "December": 12
}

class ReportView extends React.Component<Props, States> {

    constructor(p: Props) {
        super(p);
        this.state = {
            exchanges: [],
            payments: [],
            filterMonth: 'any',
            filterYear: 'any',
            filterExchange: 'any',
            filterPayment: 'any',
            filteredTransactions: []
        }
    }

    componentDidMount(): void {
        this.fetchTransactions()
        this.fetchExchanges()
        this.fetchPayments()
    }
    fetchExchanges() {
        dbAccess.getList(KEYWORD_TYPES.EXCHANGES).then((list) => {
            this.setState((s) => {
                const exchanges = ['Any'].concat(list.map(e => e.name))
                return { ...s, exchanges }
            })
        })
    }
    fetchPayments() {
        dbAccess.getList(KEYWORD_TYPES.PAYMENTS).then((list) => {
            this.setState((s) => {
                const payments = ['Any'].concat(list.map(e => e.name))
                return { ...s, payments }
            })
        });
    }
    fetchTransactions(): void {
        dbAccess.getTransactions(
            this.state.filterExchange,
            this.state.filterPayment,
            this.state.filterMonth,
            this.state.filterYear
        ).then(
            (list) => {
                this.setState({ ...this.state, filteredTransactions: list })
            }
        );
    }

    onSelectExchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log('filterExchange:', e.target.value)
        this.setState({ ...this.state, filterExchange: e.target.value })
    }
    onSelectPayment = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log('filterPayment:', e.target.value)
        this.setState({ ...this.state, filterPayment: e.target.value })
    }
    onSelectMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log('filterMonth:', e.target.value)
        this.setState({ ...this.state, filterMonth: e.target.value })
    }
    onSelectYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log('filterYear:', e.target.value)
        this.setState({ ...this.state, filterYear: e.target.value })
    }

    renderExchangesOptions() {
        return this.state.exchanges.map((e) => {
            return <option key={e} id={e}>{e}</option>
        });
    }
    renderPaymentsOptions() {
        return this.state.payments.map((e) => {
            return <option key={e} id={e}>{e}</option>
        });
    }
    renderYearOptions() {
        let options = ['Any']
        for (let i = 2020; i <= new Date().getFullYear(); i++) {
            options.push(String(i))
        }

        return options.map((e) => {
            return <option id={e} key={e}>{e}</option>
        })
    }
    clickCheckFilter = () => {
        this.fetchTransactions()
    }
    renderFiltersView() {
        let monthsOptions = []
        for (let i in MONTHS) {
            monthsOptions.push(
                <option key={i} id={i}>{i}</option>
            )
        }
        return <div>
            <p>filters view</p>
            <label>Month : </label>
            <select name="month" id="month" onChange={this.onSelectMonth}>
                {monthsOptions}
            </select>
            <br />
            <label>Year : </label>
            <select name="year" id="year" onChange={this.onSelectYear}>
                {this.renderYearOptions()}
            </select>
            <br />
            <label>Exchange : </label>
            <select name="exchange" id="exchange" onChange={this.onSelectExchange}>
                {this.renderExchangesOptions()}
            </select>
            <br />
            <label>Payment : </label>
            <select name="payment" id="payment" onChange={this.onSelectPayment}>
                {this.renderPaymentsOptions()}
            </select>
            <br />
            <button onClick={this.clickCheckFilter}>Check</button>
        </div>
    }

    // shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<States>, nextContext: any): boolean {
    //     console.log('check should update', this.props != nextProps || this.state != nextState)
    //     return this.props != nextProps || this.state != nextState;
    // }

    render(): React.ReactNode {
        return <div>
            <p>in report view</p>
            {this.renderFiltersView()}
            <br />
            <ReportNumTransactions transactions={this.state.filteredTransactions} />
            <ReportAssetsSold transactions={this.state.filteredTransactions} />
            <ReportCurrency transactions={this.state.filteredTransactions} />
        </div>
    }
}

export default ReportView;
