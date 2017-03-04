import React from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';

import AdminPanelViewTicket from 'app/admin/panel/tickets/admin-panel-view-ticket'

import Widget from 'core-components/widget';

class MainViewTicketPage extends React.Component {

    render() {
        return (
            <div className="main-view-ticket-page">
                <Widget>
                    <AdminPanelViewTicket {...this.props} avoidSeen assignmentAllowed={false} onRetrieveFail={this.onRetrieveFail.bind(this)} />
                </Widget>
            </div>
        );
    }

    onRetrieveFail() {
        if (!this.props.config['user-system-enabled']) {
            setTimeout(() => {browserHistory.push('/check-ticket')}, 2000);
        }
    }
}


export default connect((store) => {
    return {
        config: store.config
    };
})(MainViewTicketPage);