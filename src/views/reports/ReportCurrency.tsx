import React from 'react';
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
class ReportCurrency extends React.Component<Props> {
    renderReport() {
        let myrAmount = 0;
        let usdtAmount = 0;
        this.props.transactions.filter((t) => {
            const { from, to } = t;
            return from.toUpperCase() === 'MYR' && to.toUpperCase() === 'USDT'
        }).forEach((t) => {
            const { fromAmount, toAmount } = t;
            myrAmount += fromAmount
            usdtAmount += toAmount
        })
        if (myrAmount === 0 || usdtAmount === 0) {
            return <p>no data to display</p>
        }
        return <div>
            <p>Sold {myrAmount} MYR for {usdtAmount} USDT</p>
            <p>Ratio of {(myrAmount / usdtAmount).toFixed(3)} MYR/USDT</p>
        </div>
    }
    render(): React.ReactNode {
        return <div>
            <p>report currency</p>
            {this.renderReport()}
        </div>
    }
}

export default ReportCurrency;