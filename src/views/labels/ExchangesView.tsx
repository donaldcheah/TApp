import React, { CSSProperties } from 'react';
interface Props {
    list: string[]
}
const viewStyle: CSSProperties = {
    border: '1px solid',
    borderRadius: '8px',
    padding: '8px'
}
const itemStyle: CSSProperties = {
    marginLeft: '8px'
}
class ExchangesView extends React.Component<Props> {
    renderList() {
        return this.props.list.map(item => {
            return <p style={itemStyle} key={item}>{item}</p>
        });
    }
    render(): React.ReactNode {
        return <div id="exchangesList" style={viewStyle}>
            <h5>Registered Exchanges</h5>
            <hr />
            {this.renderList()}
        </div>
    }
}

export default ExchangesView;
