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
assets sold object

{
    eth:{
        amount:number
        toAmount:number
    },
    bnb:{
        amount: total bnb units
        toAmount: total myr units
    }
}
*/
const viewStyle: CSSProperties = {
    padding: '8px',
    border: '1px solid',
    borderRadius: '8px',
    marginBottom: '8px'
}
class ReportAssetsSold extends React.Component<Props> {
    renderAssetsSold() {
        let data: { [key: string]: { amount: Decimal, toAmount: Decimal } } = {}

        this.props.transactions.filter((e) => {
            return e.to.toUpperCase() === 'MYR'
        }).map((e) => {
            return {
                ...e,
                fromAmount: new Decimal(e.fromAmount),
                toAmount: new Decimal(e.toAmount)
            }
        }).forEach((e) => {
            const { from, fromAmount, toAmount } = e;

            if (!data.hasOwnProperty(from)) {
                data[from] = {
                    amount: new Decimal(0),
                    toAmount: new Decimal(0)
                }
            }
            data[from].toAmount = data[from].toAmount.add(toAmount)
            data[from].amount = data[from].amount.add(fromAmount)
        })

        const keys = Object.keys(data)
        if (keys.length === 0) {
            return <p>No data to display</p>
        }
        return keys.map((k) => {
            return <p key={k}>Sold {data[k].amount.toNumber()} {k} for {data[k].toAmount.toFixed(2)} MYR</p>
        });
    }
    render(): React.ReactNode {
        return <div id="reportAssetsSold" style={viewStyle}>
            <h5>Assets Sold</h5>
            {this.renderAssetsSold()}
        </div>
    }
}

export default ReportAssetsSold;