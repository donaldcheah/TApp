import React, { CSSProperties } from 'react';

import ReportView from './views/ReportView';
import TransactionsView from './views/TransactionsView';
import LabelsView from './views/KeywordsView';
import SettingsView from './views/SettingsView';

import AppNavigationView from './views/AppNavigationView';
import { PAGE } from './constants'

import grassImg from './imgs/grass_band.png'
const appStyle: CSSProperties = {
  fontFamily: "sans-serif",
  height: '100%',
  backgroundColor: '#C6EBA1',
  backgroundImage: `url(${grassImg})`,
  backgroundRepeat: 'repeat-x',
  backgroundAttachment: 'fixed',
  backgroundPosition: 'center bottom -50px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'scroll'
}

const contentStyle: CSSProperties = {
  marginTop: '16px',
  height: '100%',
  width: '100%',
  maxHeight: '832px',
  padding: '0px 10px'
}

interface AppProps { }
interface AppStates {
  page: PAGE
}

// const appStyle: CSSProperties = {
//   fontFamily: 'sans-serif',
//   minWidth: '480px',
//   border: '1px solid',
//   height: '100%',
// }

class App extends React.Component<AppProps, AppStates> {

  constructor(props: AppProps) {
    super(props);
    this.state = { page: PAGE.OVERVIEW }
    // this.state = { page: PAGE.ADD_TRANSACTION }
    // this.state = { page: PAGE.LABELS }
  }

  onClickOverview = () => {
    this.setState({ ...this.state, page: PAGE.OVERVIEW })
  }

  onClickAddTransaction = () => {
    this.setState({ ...this.state, page: PAGE.ADD_TRANSACTION })
  }

  onClickLabels = () => {
    this.setState({ ...this.state, page: PAGE.LABELS })
  }

  onClickSettings = () => {
    this.setState({ ...this.state, page: PAGE.SETTINGS })
  }

  render(): React.ReactNode {
    let v = null;
    switch (this.state.page) {
      case PAGE.OVERVIEW:
        v = <ReportView />;
        break;
      case PAGE.ADD_TRANSACTION:
        v = <TransactionsView />;
        break;
      case PAGE.LABELS:
        v = <LabelsView />
        break;
      case PAGE.SETTINGS:
        v = <SettingsView />
        break;
    }
    return <div id="app" style={appStyle}>
      <div id="app.content" style={contentStyle}>
        <AppNavigationView
          onClickOverview={this.onClickOverview}
          onClickAddTransaction={this.onClickAddTransaction}
          onClickLabels={this.onClickLabels}
          onClickSettings={this.onClickSettings}
        />
        {v}
      </div>

    </div>;
  }

}

export default App;
