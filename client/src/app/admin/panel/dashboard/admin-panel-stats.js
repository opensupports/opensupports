import React from 'react';

import i18n from 'lib-app/i18n';
// import Stats from 'app-components/stats';
import Header from 'core-components/header';

class AdminPanelStats extends React.Component {

    render() {
        // return (
        //     <div className="admin-panel-stats">
        //         <Header title={i18n('STATISTICS')} description={i18n('STATISTICS_DESCRIPTION')}/>
        //          <Stats type="general"/>
        //     </div>
        // );
        return (
            <div className="admin-panel-stats">
                <Header title={i18n('STATISTICS')} description={i18n('STATISTICS_DESCRIPTION')}/>
            </div>
        )
    }

}

export default AdminPanelStats;
