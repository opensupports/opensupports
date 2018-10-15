import React from 'react';
import {connect}  from 'react-redux';
import _ from 'lodash';

import i18n from 'lib-app/i18n';

import AdminDataAction from 'actions/admin-data-actions';
import TicketList from 'app-components/ticket-list';
import ModalContainer from 'app-components/modal-container';
import CreateTicketForm from 'app/main/dashboard/dashboard-create-ticket/create-ticket-form';

import Button from 'core-components/button';
import Icon from 'core-components/icon';
import Header from 'core-components/header';
import Message from 'core-components/message';

class AdminPanelMyTickets extends React.Component {

    static defaultProps = {
        userId: 0,
        departments: [],
        tickets: []
    };

    state = {
        showClosedTickets: false
    };

    componentDidMount() {
        this.props.dispatch(AdminDataAction.retrieveMyTickets());
    }

    render() {
        return (
            <div className="admin-panel-my-tickets">
                <Header title={i18n('MY_TICKETS')} description={i18n('MY_TICKETS_DESCRIPTION')} />
                {(this.props.error) ? <Message type="error">{i18n('ERROR_RETRIEVING_TICKETS')}</Message> : <TicketList {...this.getProps()}/>}
                <div style={{textAlign: 'right', marginTop: 10}}>
                    <Button onClick={this.onCreateTicket.bind(this)} type="secondary" size="medium">
                        <Icon size="sm" name="plus"/> {i18n('CREATE_TICKET')}
                    </Button>
                </div>
            </div>
        );
    }

    filterOpenedTickets(tickets){
        return _.filter(tickets, (ticket) => {
            return !ticket.closed
        });
    }

    getProps() {
        return {
            userId: this.props.userId,
            departments: this.props.departments,
            tickets: this.state.showClosedTickets ? this.props.tickets : this.filterOpenedTickets(this.props.tickets),
            type: 'secondary',
            loading: this.props.loading,
            ticketPath: '/admin/panel/tickets/view-ticket/',
            filterClosedTickets: true,
            showClosedTickets: this.state.showClosedTickets,
            onShowClosedTicketsChange: this.onShowClosedTicketsChange.bind(this) 
        };
    }

    onShowClosedTicketsChange() {
        this.setState(function(state) {
            return {
                showClosedTickets: !state.showClosedTickets
            };
        });
    }

    onCreateTicket() {
        ModalContainer.openModal(
            <div>
                <CreateTicketForm onSuccess={this.onCreateTicketSuccess.bind(this)} />
                <div style={{textAlign: 'center'}}>
                    <Button onClick={ModalContainer.closeModal} type="link">{i18n('CLOSE')}</Button>
                </div>
            </div>
        );
    }

    onCreateTicketSuccess() {
        ModalContainer.closeModal();
        this.props.dispatch(AdminDataAction.retrieveMyTickets());
    }
}

export default connect((store) => {
    return {
        userId: store.session.userId,
        departments: store.session.userDepartments,
        tickets: store.adminData.myTickets,
        loading: !store.adminData.myTicketsLoaded,
        error: store.adminData.myTicketsError
    };
})(AdminPanelMyTickets);
