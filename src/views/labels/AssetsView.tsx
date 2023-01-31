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
class AssetsView extends React.Component<Props> {
    renderAssetsList() {
        return this.props.list.map(item => {
            return <p style={itemStyle} key={item}>{item}</p>
        });
    }
    render(): React.ReactNode {
        return <div id="assetsList" style={viewStyle}>
            <h5>Registered Assets</h5>
            <hr />
            {this.renderAssetsList()}
        </div>
    }
}

export default AssetsView;
