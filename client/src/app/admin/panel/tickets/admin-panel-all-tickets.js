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
        closedTicketsShown: 0
    };

    componentDidMount() {
        this.updateTicketList();
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

    updateTicketList() {
        this.props.dispatch(AdminDataAction.retrieveAllTickets(
            this.state.page,
            this.state.query,
            this.state.closedTicketsShown * 1
        ));
    }

    getTicketListProps() {
        const {
            userId,
            departments,
            tickets,
            loading,
            pages
        } = this.props;
        const {
            page,
            closedTicketsShown
        } = this.state;

        return {
            userId,
            showDepartmentDropdown: false,
            departments,
            tickets,
            type: 'secondary',
            loading,
            ticketPath: '/admin/panel/tickets/view-ticket/',
            onPageChange: this.onPageChange.bind(this),
            page,
            pages,
            closedTicketsShown: closedTicketsShown ? true : false,
            onClosedTicketsShownChange: this.onClosedTicketsShownChange.bind(this)
        };
    }

    onClosedTicketsShownChange() {
        this.setState(function(state) {
            return {
                closedTicketsShown: !state.closedTicketsShown
            };
        }, () => {
            this.updateTicketList();
        });
    }

    onSearch(query) {
        this.setState({query, page: 1}, () => {
            this.updateTicketList();
        });
    }

    onPageChange(event) {
        this.setState({page: event.target.value}, () => {
            this.updateTicketList();
        });
    }
}

export default connect((store) => {
    return {
        userId: store.session.userId*1,
        departments: store.session.userDepartments,
        tickets: store.adminData.allTickets,
        pages: store.adminData.allTicketsPages,
        loading: !store.adminData.allTicketsLoaded,
        error: store.adminData.allTicketsError
    };
})(AdminPanelAllTickets);
