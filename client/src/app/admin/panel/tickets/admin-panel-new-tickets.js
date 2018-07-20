import React from 'react';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';

import AdminDataAction from 'actions/admin-data-actions';
import TicketList from 'app-components/ticket-list';

import Header from 'core-components/header';
import Message from 'core-components/message';

class AdminPanelNewTickets extends React.Component {

    static defaultProps = {
        userId: 0,
        departments: [],
        tickets: []
    };

    componentDidMount() {
        this.props.dispatch(AdminDataAction.retrieveNewTickets());
    }

    render() {
        return (
            <div className="admin-panel-my-tickets">
                <Header title={i18n('NEW_TICKETS')} description={i18n('NEW_TICKETS_DESCRIPTION')} />
                {(this.props.error) ? <Message type="error">{i18n('ERROR_RETRIEVING_TICKETS')}</Message> : <TicketList {...this.getProps()}/>}
            </div>
        );
    }

    getProps() {
        return {
            userId: this.props.userId,
            departments: this.props.departments,
            tickets: this.props.tickets,
            type: 'secondary',
            loading: this.props.loading,
            ticketPath: '/admin/panel/tickets/view-ticket/'
        };
    }
}

export default connect((store) => {
    return {
        userId: store.session.userId,
        departments: store.session.userDepartments,
        tickets: store.adminData.newTickets,
        loading: !store.adminData.newTicketsLoaded,
        error: store.adminData.newTicketsError
    };
})(AdminPanelNewTickets);
