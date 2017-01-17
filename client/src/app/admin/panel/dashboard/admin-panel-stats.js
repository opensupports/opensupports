import React from 'react';

import i18n from 'lib-app/i18n';
import Stats from 'app-components/stats';
import Header from 'core-components/header';

class AdminPanelStats extends React.Component {

    render() {
        return (
            <div class="admin-panel-stats">
                <Header title={i18n('TICKET_ACTIVITY')} description={i18n('TICKET_ACTIVITY_DESCRIPTION')}/>
                <Stats type="general"/>
            </div>
        );
    }
    
}

export default AdminPanelStats;