import React from 'react';
interface Props {
    list: string[]
}
class AssetsView extends React.Component<Props> {
    renderAssetsList() {
        return this.props.list.map(item => {
            return <p key={item}>{item}</p>
        });
    }
    render(): React.ReactNode {
        return <div>
            <p>Asset view</p>
            {this.renderAssetsList()}

        </div>
    }
}

export default AssetsView;
