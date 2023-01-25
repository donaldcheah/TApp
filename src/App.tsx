import React from 'react';
// import './App.css';

import ReportView from './views/ReportView';
import AddTransactionView from './views/AddTransactionView';
import LabelsView from './views/KeywordsView';
import SettingsView from './views/SettingsView';

import AppNavigationView from './views/AppNavigationView';


enum PAGE {
  OVERVIEW, ADD_TRANSACTION, LABELS, SETTINGS
}

interface AppProps { }
interface AppStates {
  page: PAGE
}

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
        v = <AddTransactionView />;
        break;
      case PAGE.LABELS:
        v = <LabelsView />
        break;
      case PAGE.SETTINGS:
        v = <SettingsView />
        break;
    }
    return <div>
      <AppNavigationView
        onClickOverview={this.onClickOverview}
        onClickAddTransaction={this.onClickAddTransaction}
        onClickLabels={this.onClickLabels}
        onClickSettings={this.onClickSettings}
      />
      {v}
    </div>;
  }

}

export default App;
