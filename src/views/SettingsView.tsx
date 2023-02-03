import React, { CSSProperties } from 'react';
import { dbAccess } from '../DBAccess';

const viewStyle: CSSProperties = {
    border: '1px solid',
    borderRadius: '8px',
    marginTop: '8px',
    padding: '8px'
}
const exportStyle: CSSProperties = {
    display: 'block'
}
const buttonStyle: CSSProperties = {
    marginBottom: '8px'
}

class SettingsView extends React.Component {
    onClickExportTransactions = () => {
        console.log('exporting transactions csv')
        dbAccess.downloadTransactionsCSV()
    }
    onClickExportAssets = () => { }
    onClickExportExchanges = () => { }
    onClickExportPayments = () => { }
    onClickImport = () => {

    }
    render(): React.ReactNode {
        return <div id="settings" style={viewStyle}>
            <div id="settings.export" style={exportStyle}>
                <h5>Export as CSV</h5>
                {/* <button onClick={this.onClickExport}>Export CSV</button> */}
                <button onClick={this.onClickExportTransactions} style={buttonStyle}>Transactions</button><br />
                <button style={buttonStyle} disabled>Assets</button><br />
                <button style={buttonStyle} disabled>Exchanges</button><br />
                <button style={buttonStyle} disabled>Payments</button><br />
            </div>
            <div id="settings.import">
                <h5>Import CSV file</h5>
                <button style={buttonStyle} onClick={this.onClickImport} disabled>Import CSV</button>
            </div>
        </div>
    }
}

export default SettingsView;