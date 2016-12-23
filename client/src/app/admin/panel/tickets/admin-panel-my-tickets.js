import React from 'react';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';

import AdminDataAction from 'actions/admin-data-actions';
import TicketList from 'app-components/ticket-list';

import Header from 'core-components/header';
import Message from 'core-components/message';

class AdminPanelMyTickets extends React.Component {

    static defaultProps = {
        departments: [],
        tickets: []
    };

    componentDidMount() {
        this.props.dispatch(AdminDataAction.retrieveMyTickets());
    }
    
    render() {
        return (
            <div className="admin-panel-my-tickets">
                <Header title={i18n('MY_TICKETS')} description={i18n('MY_TICKETS_DESCRIPTION')} />
                {(this.props.error) ? <Message type="error">{i18n('ERROR_RETRIEVING_TICKETS')}</Message> : <TicketList {...this.getProps()}/>}
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
        tickets: store.adminData.myTickets,
        loading: !store.adminData.myTicketsLoaded,
        error: store.adminData.myTicketsError
    };
})(AdminPanelMyTickets);
