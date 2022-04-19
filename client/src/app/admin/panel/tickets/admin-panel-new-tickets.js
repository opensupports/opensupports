import React from 'react';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';

import AdminDataAction from 'actions/admin-data-actions';
import TicketList from 'app-components/ticket-list';

import Header from 'core-components/header';
import Message from 'core-components/message';

class AdminPanelNewTickets extends React.Component {

    static defaultProps = {
        page: 1,
        userId: 0,
        departments: [],
        tickets: [],
    };

    state = {
        departmentId: null,
        pageSize: 10
    };

    componentDidMount() {
        this.retrieveNewTickets({});
    }

    render() {
        const noDepartments = !this.props.departments.length;
        return (
            <div className="admin-panel-new-tickets">
                <Header title={i18n('NEW_TICKETS')} description={i18n('NEW_TICKETS_DESCRIPTION')} />
                {(noDepartments) ? <Message showCloseButton={false} className="admin-panel-new-tickets__department-warning" type="warning">{i18n('NO_DEPARTMENT_ASSIGNED')}</Message> : null}
                {(this.props.error) ? <Message showCloseButton={false} type="error">{i18n('ERROR_RETRIEVING_TICKETS')}</Message> : <TicketList {...this.getProps()} />}
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
            ticketPath: '/admin/panel/tickets/view-ticket/',
            page: this.props.page,
            pages: this.props.pages,
            onPageChange: event => this.retrieveNewTickets({page: event.target.value}),
            onDepartmentChange: departmentId => {
                this.setState({departmentId});
                this.retrieveNewTickets({page: 1, departmentId});
            },
            onPageSizeChange: pageSize => {
                this.setState({pageSize});
                this.retrieveNewTickets({page: 1, pageSize});
            }
        };
    }

    retrieveNewTickets({page = this.props.page, departmentId = this.state.departmentId, pageSize = this.state.pageSize }) {
        this.props.dispatch(AdminDataAction.retrieveNewTickets({page, departmentId, pageSize}));
    }
}

export default connect((store) => {
    return {
        userId: store.session.userId*1,
        departments: store.session.userDepartments,
        tickets: store.adminData.newTickets,
        page: store.adminData.newTicketsPage,
        pages: store.adminData.newTicketsPages,
        loading: !store.adminData.newTicketsLoaded,
        error: store.adminData.newTicketsError
    };
})(AdminPanelNewTickets);
