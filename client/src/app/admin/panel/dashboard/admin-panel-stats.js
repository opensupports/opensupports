import React from 'react';

import i18n from 'lib-app/i18n';

import Header from 'core-components/header';
import DropDown from 'core-components/drop-down';
import StatsChart from 'app/admin/panel/dashboard/admin-panel-stats-chart';

class AdminPanelStats extends React.Component {

    render() {
        return (
            <div>
                <Header title={i18n('TICKET_ACTIVITY')}/>
                <DropDown {...this.getDropDownProps()}/>
                <StatsChart />
            </div>
        );
    }

    getDropDownProps() {
        return {
            items: [
                {
                    content: 'Last 7 days',
                    icon: ''
                },
                {
                    content: 'Last 30 days',
                    icon: ''
                },
                {
                    content: 'Last 90 days',
                    icon: ''
                },
                {
                    content: 'Last 365 days',
                    icon: ''
                }
            ]
        }
    }
}

export default AdminPanelStats;