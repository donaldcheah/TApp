import React, { CSSProperties } from 'react'
import { dbAccess } from '../../DBAccess'
import "./table.css"

interface Props {

}
interface State {
    transactions: any[]
}

enum SHOW_AMOUNT {
    THREE = 3,
    FIVE = 5,
    TEN = 10
}

const latestStyle: CSSProperties = {
    border: '1px solid',
    borderRadius: '8px',
    marginTop: '8px',
    padding: '8px'
}
class LatestTransactionsView extends React.Component<Props, State> {
    _showAmount: number
    constructor(p: Props) {
        super(p)
        this.state = {
            transactions: []
        }
        this._showAmount = SHOW_AMOUNT.THREE
    }

    componentDidMount(): void {
        this._fetchData()
    }

    forceUpdateData() {
        this._fetchData()
    }

    private _fetchData() {
        console.log('latest transactionss fetch data')
        dbAccess.getLatestTransactions(this._showAmount).then((arr) => {
            // console.log('latest N :', arr)
            this.setState({ ...this.state, transactions: arr })
        })
    }

    deleteData = (index: number) => {
        const targetDataID = this.state.transactions[index].id
        if (window.confirm(`Confirm delete entry ID ${targetDataID}?`)) {
            // console.log('delete id : ', targetDataID)
            dbAccess.deleteTransaction(targetDataID).then(() => {
                this._fetchData()
            })
        }
    }
    doSmth() {
        console.log('do smth')
    }

    private _renderTransactionsList() {
        if (this.state.transactions.length === 0)
            return <p>No data yet</p>

        return <div id="tableContainer" style={{ display: 'flex' }}>
            <table>
                <thead>
                    <tr>
                        <th className='th_date'>date</th>
                        <th>from</th>
                        <th>amount</th>
                        <th>to</th>
                        <th>amount</th>
                        <th>exchange</th>
                        <th>payment</th>
                        <th>ID</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.transactions.map((e, index) => {
                        return <tr key={e.id}>
                            <td>{new Date(e.date).toLocaleString()}</td>
                            <td>{e.from}</td>
                            <td>{e.fromAmount}</td>
                            <td>{e.to}</td>
                            <td>{e.toAmount}</td>
                            <td>{e.exchange}</td>
                            <td>{e.payment}</td>
                            <td>{e.id}</td>
                            <td><button onClick={() => this.deleteData(index)}>Delete</button></td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    }

    onChangeShowAmount = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log('show ', e.target.selectedOptions[0].value)
        this._showAmount = Number(e.target.selectedOptions[0].value)
        this._fetchData()
    }

    render(): React.ReactNode {
        return <div id="latestTransactions" style={latestStyle}>
            <div id="latestTransactions.header">
                <h5>Show <select onChange={this.onChangeShowAmount}>
                    <option>{SHOW_AMOUNT.THREE}</option>
                    <option>{SHOW_AMOUNT.FIVE}</option>
                    <option>{SHOW_AMOUNT.TEN}</option>
                </select> Latest Transactions</h5>

            </div>
            <hr />
            {this._renderTransactionsList()}
        </div>
    }
}

export default LatestTransactionsView;