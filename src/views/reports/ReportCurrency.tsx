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
class ReportCurrency extends React.Component<Props> {
    renderReport() {
        return TargetCurrencies.map((c) => {
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
            return <div key={c} style={currencyStyle}>
                <h5 style={currencyTitleStyle}>{c}</h5>
                <hr />
                <p>Sold {myrAmount.toFixed(2)} {BaseCurrency} for {usdtAmount.toNumber()} {c}</p>
                <p>Ratio of {(myrAmount.dividedBy(usdtAmount)).toFixed(2)} {BaseCurrency}/{c}</p>
            </div>
        })
    }

    render(): React.ReactNode {
        return <div id="reportCurrency" style={viewStyle}>
            <h5>Currency ({TargetCurrencies.join(',')})</h5>
            {this.renderReport()}
        </div>
    }
}

export default ReportCurrency;