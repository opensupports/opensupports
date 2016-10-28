import React from 'react';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';

import AdminDataAction from 'actions/admin-data-actions';
import Header from 'core-components/header';
import TicketList from 'app-components/ticket-list';

class AdminPanelAllTickets extends React.Component {

    static defaultProps = {
        departments: [],
        tickets: []
    };

    componentDidMount() {
        this.props.dispatch(AdminDataAction.retrieveAllTickets());
    }

    render() {
        return (
            <div className="admin-panel-my-tickets">
                <Header title={i18n('ALL_TICKETS')} description={i18n('ALL_TICKETS_DESCRIPTION')} />
                <TicketList {...this.getProps()}/>
            </div>
        );
    }

    getProps() {
        return {
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
        departments: store.session.userDepartments,
        tickets: store.adminData.newTickets,
        loading: !store.adminData.newTicketsLoaded
    };
})(AdminPanelAllTickets);
