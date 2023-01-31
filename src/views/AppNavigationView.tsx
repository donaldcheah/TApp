import React, { CSSProperties } from 'react'

interface Props {
    onClickOverview: () => void,
    onClickAddTransaction: () => void,
    onClickLabels: () => void
    onClickSettings: () => void
}
interface State { }
const style: CSSProperties = {
    padding: "10px",
    border: '1px solid',
    borderRadius: "5px",
    display: 'flex',
    justifyContent: 'center'
}
const btnStyle: CSSProperties = {
    flex: 1,
    // maxWidth: '100px',
    marginRight: '5px',
    padding: '5px',
    height: '40px'
}
class AppNavigationView extends React.Component<Props, State> {

    render(): React.ReactNode {
        return <div id="nav" style={style}>
            <button style={btnStyle} onClick={this.props.onClickOverview}>Overview</button>
            <button style={btnStyle} onClick={this.props.onClickAddTransaction}>Transactions</button>
            <button style={btnStyle} onClick={this.props.onClickLabels}>Keywords</button>
            <button style={btnStyle} onClick={this.props.onClickSettings}>Settings</button>
        </div>
    }
}

export default AppNavigationView;