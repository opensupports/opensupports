import React from 'react';

import Header from 'core-components/header';

import i18n from 'lib-app/i18n';
import ActivityRow from 'app-components/activity-row';

class AdminPanelActivity extends React.Component {

    render() {
        return (
            <div>
                <Header title={i18n('LAST_ACTIVITY')} />
                <ActivityRow {...this.getActivityRowProps()} />
                <ActivityRow {...this.getActivityRowProps2()} />
                <ActivityRow {...this.getActivityRowProps3()} />
                <ActivityRow {...this.getActivityRowProps()} />
            </div>
        );
    }

    getActivityRowProps() {
        return {
            "type": "COMMENT",
            "ticketNumber": "683061",
            "author": {
                "name": "Tyrion Lannister",
                "staff": false,
                "id": "10"
            }
        }
    }

    getActivityRowProps2() {
        return {
            "type": "RE_OPEN",
            "ticketNumber": "683049",
            "author": {
                "name": "Emilia Clarke",
                "staff": true,
                "id": "1"
            }
        }
    }

    getActivityRowProps3() {
        return {
            "type": "UN_ASSIGN",
            "ticketNumber": "683049",
            "author": {
                "name": "Emilia Clarke",
                "staff": true,
                "id": "1"
            }
        }
    }
}

export default AdminPanelActivity;