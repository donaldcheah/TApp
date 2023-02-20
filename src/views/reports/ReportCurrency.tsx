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
const TargetCurrencies = ['USDT', 'USDC']
const BaseCurrency = 'MYR'

const viewStyle: CSSProperties = {
    padding: '8px',
    border: '1px solid',
    borderRadius: '8px',
    marginBottom: '8px'
}
const currencyStyle: CSSProperties = {
    border: '1px solid',
    borderRadius: '8px',
    marginBottom: '8px',
    padding: '8px',
}
const currencyTitleStyle: CSSProperties = {
    margin: '0px'
}
const totalViewStyle: CSSProperties = {
    fontWeight: 'bold'
}
class ReportCurrency extends React.Component<Props> {
    renderReport() {
        let total = new Decimal(0)
        const views = TargetCurrencies.map((c) => {
            let myrAmount: Decimal = new Decimal(0);
            let usdtAmount: Decimal = new Decimal(0);
            this.props.transactions.filter((t) => {
                const { from, to } = t;
                return from.toUpperCase() === BaseCurrency && to.toUpperCase() === c
            }).forEach((t) => {
                const { fromAmount, toAmount } = t;
                myrAmount = myrAmount.add(fromAmount)
                usdtAmount = usdtAmount.add(toAmount)
            })
            if (myrAmount.toNumber() === 0 || usdtAmount.toNumber() === 0) {
                return <p key={c}>no data to display</p>
            }
            total = total.add(myrAmount)
            return <div key={c} style={currencyStyle}>
                <h5 style={currencyTitleStyle}>{c}</h5>
                <hr />
                <p>Sold {myrAmount.toFixed(2)} {BaseCurrency} for {usdtAmount.toNumber()} {c}</p>
                <p>Ratio : {(myrAmount.dividedBy(usdtAmount)).toFixed(2)} {BaseCurrency}/{c}</p>
            </div>
        })
        if (!total.equals(0))
            views.push(<p style={totalViewStyle} key="total">Total spent {total.toFixed(2)} MYR</p>)

        return views
    }

    render(): React.ReactNode {
        return <div id="reportCurrency" style={viewStyle}>
            <h5>Currency ({TargetCurrencies.join(',')})</h5>
            {this.renderReport()}
            <br />
        </div>
    }
}

export default ReportCurrency;