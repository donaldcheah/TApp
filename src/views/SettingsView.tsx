import React, { CSSProperties } from 'react';

const viewStyle: CSSProperties = {
    border: '1px solid',
    borderRadius: '8px',
    marginTop: '8px',
    padding: '8px'
}

class SettingsView extends React.Component {
    render(): React.ReactNode {
        return <div id="settings" style={viewStyle}>
            <div>in settings view, functionality pending</div>
            <p>much later, when everything else done...</p>
            <button>Export CSV</button>
            <button>Import CSV</button>
        </div>
    }
}

export default SettingsView;