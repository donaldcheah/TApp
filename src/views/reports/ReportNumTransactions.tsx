import React from 'react'

interface Props {
    transactions: any[]
}
class ReportNumTransactions extends React.Component<Props> {

    renderOutput() {
        return <label>{this.props.transactions.length}</label>
    }

    render() {
        return <div>
            <p>report number of transactions</p>
            <label>Number of transactions : </label>
            {this.renderOutput()}
        </div>
    }
}

export default ReportNumTransactions;