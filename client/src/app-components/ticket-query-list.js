import React from 'react';
import _ from 'lodash';

import i18n from 'lib-app/i18n';
import {connect}  from 'react-redux';

import TicketList from 'app-components/ticket-list';
import Message from 'core-components/message';
import searchFiltersActions from '../actions/search-filters-actions';
import queryString from 'query-string';
import searchTicketsUtils from 'lib-app/search-tickets-utils';
import history from 'lib-app/history';

class TicketQueryList extends React.Component {

    state = {
        tickets: [],
        page: 1,
        pages: 0,
        error: null,
        loading: true
    };

    render() {
        return (
            this.state.error ?
                <Message showCloseButton={false} type="error">{i18n('ERROR_RETRIEVING_TICKETS')}</Message> :
                <TicketList {...this.getTicketListProps()} />
        );
    }

    onPageChange(event) {
        const {
            dispatch,
            filters
        } = this.props;

        dispatch(searchFiltersActions.changePage({
            ...filters,
            page: event.target.value
        }));
    }

    getTicketListProps () {
        const {
            filters,
            onChangeOrderBy,
            userId,
            ticketQueryListState
        } = this.props;
        const page = {
            ...ticketQueryListState,
            ...queryString.parse(window.location.search)
        }.page*1;

        return {
            userId: userId,
            ticketPath: '/admin/panel/tickets/view-ticket/',
            tickets: ticketQueryListState.tickets,
            page: page,
            pages: ticketQueryListState.pages,
            loading: ticketQueryListState.loading,
            type: 'secondary',
            showDepartmentDropdown: false,
            closedTicketsShown: false,
            onPageChange:this.onPageChange.bind(this),
            orderBy: filters.orderBy ? JSON.parse(filters.orderBy) : filters.orderBy,
            showOrderArrows: true,
            onChangeOrderBy: onChangeOrderBy,
            showPageSizeDropdown: false
        };
    }

}

export default connect((store) => {
    return {
        userId: store.session.userId*1,
        filters: store.searchFilters.listConfig.filters,
        ticketQueryListState: store.searchFilters.ticketQueryListState
    };
})(TicketQueryList);
