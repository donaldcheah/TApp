import React, { CSSProperties } from 'react';
import { Decimal } from 'decimal.js'
interface Props {
    transactions: any[]
}
/*
transaction object
{
    id
    date
    from
    fromAmount
    to
    toAmount
    exchange
    payment
}
*/
const viewStyle: CSSProperties = {
    padding: '8px',
    border: '1px solid',
    borderRadius: '8px',
    marginBottom: '8px'
}
class ReportCurrency extends React.Component<Props> {
    renderReport() {
        let myrAmount: Decimal = new Decimal(0);
        let usdtAmount: Decimal = new Decimal(0);
        this.props.transactions.filter((t) => {
            const { from, to } = t;
            return from.toUpperCase() === 'MYR' && to.toUpperCase() === 'USDT'
        }).forEach((t) => {
            const { fromAmount, toAmount } = t;
            myrAmount = myrAmount.add(fromAmount)
            usdtAmount = usdtAmount.add(toAmount)
        })
        if (myrAmount.toNumber() === 0 || usdtAmount.toNumber() === 0) {
            return <p>no data to display</p>
        }
        return <div>
            <p>Sold {myrAmount.toFixed(2)} MYR for {usdtAmount.toNumber()} USDT</p>
            <p>Ratio of {(myrAmount.dividedBy(usdtAmount)).toFixed(2)} MYR/USDT</p>
        </div>
    }
    render(): React.ReactNode {
        return <div id="reportCurrency" style={viewStyle}>
            <h5>Currency</h5>
            {this.renderReport()}
        </div>
    }
}

export default ReportCurrency;