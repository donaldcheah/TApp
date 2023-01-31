import React, { CSSProperties } from 'react'

interface Props {
    transactions: any[]
}

const viewStyle: CSSProperties = {
    padding: '8px',
    border: '1px solid',
    borderRadius: '8px',
    marginBottom: '8px'
}
class ReportNumTransactions extends React.Component<Props> {

    renderOutput() {
        return <p>Number of transactions : {this.props.transactions.length}</p>
    }

    render() {
        return <div id="reportNumTransactions" style={viewStyle}>
            <h5># Transactions</h5>
            {this.renderOutput()}
        </div>
    }
}

export default ReportNumTransactions;