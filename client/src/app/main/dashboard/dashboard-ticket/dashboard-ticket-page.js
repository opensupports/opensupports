import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';

import TicketViewer from 'app/main/dashboard/dashboard-ticket/ticket-viewer';

class DashboardTicketPage extends React.Component {

    static propTypes = {
        tickets: React.PropTypes.array
    };

    render() {
        return (
            <div className="dashboard-ticket-page">
                <TicketViewer ticket={this.getTicketData()} />
            </div>
        );
    }

    getTicketData() {
        return _.find(this.props.tickets, {ticketNumber: this.props.params.ticketNumber});
    }
}

export default connect((store) => {
    return {
        tickets: store.session.userTickets
    };
})(DashboardTicketPage);