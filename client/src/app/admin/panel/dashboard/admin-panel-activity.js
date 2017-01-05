import React from 'react';

import i18n from 'lib-app/i18n';

import Header from 'core-components/header';
import Menu from 'core-components/menu';

import ActivityList from 'app/admin/panel/dashboard/activity-list';

class AdminPanelActivity extends React.Component {

    render() {
        return (
            <div className="admin-panel-activity">
                <Header title={i18n('LAST_ACTIVITY')} />
                <Menu {...this.getMenuProps()} />
                <ActivityList />
            </div>
        );
    }
    
    getMenuProps() {
        return {
            className: 'admin-panel-activity__menu',
            type: 'horizontal-list-bright',
            items: [
                {
                    content: i18n('MY_NOTIFICATIONS'),
                    icon: ''
                },
                {
                    content: i18n('ALL_NOTIFICATIONS'),
                    icon: ''
                }
            ]
        }
    }
}

export default AdminPanelActivity;