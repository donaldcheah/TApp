import { CSSProperties } from 'react'

interface Props {
    transactions: any[]
}

const viewStyle: CSSProperties = {
    padding: '8px',
    border: '1px solid',
    borderRadius: '8px',
    marginBottom: '8px'
}

export default function ReportNumTransactions({ transactions }: Props) {
    return <div id="reportNumTransactions" style={viewStyle}>
        <h5># Transactions : {transactions.length}</h5>
    </div>
}