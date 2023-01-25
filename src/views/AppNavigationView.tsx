import React from 'react'

interface Props {
    onClickOverview: () => void,
    onClickAddTransaction: () => void,
    onClickLabels: () => void
    onClickSettings: () => void
}
interface State { }
class AppNavigationView extends React.Component<Props, State> {

    // constructor(props: Props) {
    //     super(props)
    // }

    render(): React.ReactNode {
        return <div>
            <button onClick={this.props.onClickOverview}>Overview</button>
            <button onClick={this.props.onClickAddTransaction}>Add Transaction</button>
            <button onClick={this.props.onClickLabels}>Keywords</button>
            <button onClick={this.props.onClickSettings}>Settings</button>
        </div>
    }
}

export default AppNavigationView;