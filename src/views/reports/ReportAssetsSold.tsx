import React, { CSSProperties } from 'react';

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
        let data: { [key: string]: { amount: number, toAmount: number } } = {}
        this.props.transactions.filter((e) => {
            return e.to.toUpperCase() === 'MYR'
        }).forEach((e) => {
            const { from, fromAmount, toAmount } = e;

            if (!data.hasOwnProperty(from)) {
                data[from] = {
                    amount: 0,
                    toAmount: 0
                }
            }

            data[from].toAmount += toAmount
            data[from].amount += fromAmount

        })
        const keys = Object.keys(data)
        if (keys.length === 0) {
            return <p>No data to display</p>
        }
        return keys.map((k) => {
            return <p key={k}>Sold {data[k].amount} {k} for {data[k].toAmount} MYR</p>
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