import React from 'react';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';

import AdminDataAction from 'actions/admin-data-actions';
import TicketList from 'app-components/ticket-list';

import Header from 'core-components/header';
import SearchBox from 'core-components/search-box';
import Message from 'core-components/message';

class AdminPanelAllTickets extends React.Component {

    static defaultProps = {
        userId: 0,
        departments: [],
        tickets: []
    };

    state = {
        page: 1,
        query: '',
        closedTicketsShown: false
    };

    componentDidMount() {
        this.props.dispatch(AdminDataAction.retrieveAllTickets());
    }

    render() {
        const noDepartments = !this.props.departments.length;
        return (
            <div className="admin-panel-all-tickets">
                <Header title={i18n('ALL_TICKETS')} description={i18n('ALL_TICKETS_DESCRIPTION')} />
                {(noDepartments) ? <Message className="admin-panel-all-tickets__department-warning" type="warning">{i18n('NO_DEPARTMENT_ASSIGNED')}</Message> : null}
                <div className="admin-panel-all-tickets__search-box">
                    <SearchBox onSearch={this.onSearch.bind(this)} />
                </div>
                {(this.props.error) ? <Message type="error">{i18n('ERROR_RETRIEVING_TICKETS')}</Message> : <TicketList {...this.getTicketListProps()}/>}
            </div>
        );
    }

    getTicketListProps() {
        return {
            userId: this.props.userId,
            showDepartmentDropdown: false,
            departments: this.props.departments,
            tickets: this.props.tickets,
            type: 'secondary',
            loading: this.props.loading,
            ticketPath: '/admin/panel/tickets/view-ticket/',
            onPageChange: this.onPageChange.bind(this),
            page: this.state.page,
            pages: this.props.pages,
            closedTicketsShown: this.state.closedTicketsShown,
            onClosedTicketsShownChange: this.onClosedTicketsShownChange.bind(this) 
        };
    }

    onClosedTicketsShownChange() {
        this.setState(function(state) {
            return {
                closedTicketsShown: !state.closedTicketsShown
            };
        }, () => {
            this.props.dispatch(AdminDataAction.retrieveAllTickets(this.state.page, this.state.closedTicketsShown * 1));
        });
    }

    onSearch(query) {
        this.setState({query, page: 1});

        if(query) {
            this.props.dispatch(AdminDataAction.searchTickets(query));
        } else {
            this.props.dispatch(AdminDataAction.retrieveAllTickets());
        }
    }

    onPageChange(event) {
        this.setState({page: event.target.value});

        if(this.state.query) {
            this.props.dispatch(AdminDataAction.searchTickets(this.state.query, event.target.value));
        } else {
            this.props.dispatch(AdminDataAction.retrieveAllTickets(event.target.value));
        }
    }
}

export default connect((store) => {
    return {
        userId: store.session.userId,
        departments: store.session.userDepartments,
        tickets: store.adminData.allTickets,
        pages: store.adminData.allTicketsPages,
        loading: !store.adminData.allTicketsLoaded,
        error: store.adminData.allTicketsError
    };
})(AdminPanelAllTickets);
