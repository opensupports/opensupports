import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';

import SessionActions from 'actions/session-actions';
import TicketViewer from 'app-components/ticket-viewer';

class DashboardTicketPage extends React.Component {

    static propTypes = {
        tickets: React.PropTypes.array
    };

    render() {
        return (
            <div className="dashboard-ticket-page">
                <TicketViewer ticket={this.getTicketData()} onComment={this.retrieveUserData.bind(this)}/>
            </div>
        );
    }

    getTicketData() {
        return _.find(this.props.tickets, {ticketNumber: this.props.params.ticketNumber});
    }

    retrieveUserData() {
        this.props.dispatch(SessionActions.getUserData());
    }
}

export default connect((store) => {
    return {
        tickets: store.session.userTickets
    };
})(DashboardTicketPage);