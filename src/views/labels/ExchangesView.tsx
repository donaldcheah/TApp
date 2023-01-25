import React from 'react';
interface Props {
    list: string[]
}
class ExchangesView extends React.Component<Props> {
    renderList() {
        return this.props.list.map(item => {
            return <p key={item}>{item}</p>
        });
    }
    render(): React.ReactNode {
        return <div>
            <p>exchanges view</p>
            {this.renderList()}
        </div>
    }
}

export default ExchangesView;
