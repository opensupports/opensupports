import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import SessionActions from 'actions/session-actions';
import TicketViewer from 'app-components/ticket-viewer';

class DashboardTicketPage extends React.Component {

    static propTypes = {
        tickets: React.PropTypes.array
    };

    componentDidMount() {
        let ticket = this.getTicketData();
        if(ticket.unread) {
            API.call({
                path: '/ticket/seen',
                data: {
                    ticketNumber: ticket.ticketNumber
                }
            })
        }
    }

    render() {
        let ticketView = i18n('NO_PERMISSION');
        if(!_.isEmpty(this.getTicketData())) {
            ticketView = <TicketViewer ticket={this.getTicketData()} onChange={this.retrieveUserData.bind(this)}/>;
        }
        return (
            <div className="dashboard-ticket-page">
                {ticketView}
            </div>
        );
    }

    getTicketData() {
        return _.find(this.props.tickets, {ticketNumber: this.props.params.ticketNumber}) || {};
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
