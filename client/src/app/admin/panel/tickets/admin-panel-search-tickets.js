import React from 'react';
import {connect}  from 'react-redux';
import queryString from 'query-string';
import store from 'app/store';

import i18n from 'lib-app/i18n';
import searchTicketsUtils from 'lib-app/search-tickets-utils';

import searchFiltersActions from 'actions/search-filters-actions';

import TicketQueryList from 'app-components/ticket-query-list';
import TicketQueryFilters from 'app-components/ticket-query-filters';

import Header from 'core-components/header';
import Message from 'core-components/message';
import Icon from 'core-components/icon';
import Button from 'core-components/button';

const INITIAL_PAGE = 1;
const SEARCH_TICKETS_PATH = '/search-tickets';
const SEARCH_TICKETS_INITIAL_QUERY = `?page=${INITIAL_PAGE}&useInitialValues=true`;

export function updateSearchTicketsFromURL() {
    const currentPathName = window.location.pathname;
    const currentSearch = window.location.search;
    const currentPath = `${currentPathName}${currentSearch}`;

    if(currentPath.includes(SEARCH_TICKETS_PATH)) {
        searchTicketsUtils.getFiltersFromParams().then((listConfig) => {
            const currentSearchParams = queryString.parse(currentSearch);
            const showFilters = (currentSearch !== SEARCH_TICKETS_INITIAL_QUERY) && currentSearchParams.custom;

            if(showFilters !== undefined && currentSearchParams.useInitialValues) store.dispatch(searchFiltersActions.changeShowFilters(!showFilters));

            store.dispatch(searchFiltersActions.changeFilters(listConfig));
            store.dispatch(searchFiltersActions.retrieveSearchTickets(
                {
                    ...store.getState().searchFilters.ticketQueryListState,
                    page: (currentSearchParams.page || INITIAL_PAGE)*1
                },
                searchTicketsUtils.getFiltersForAPI(listConfig.filters),
                currentSearchParams.pageSize
            ));
        });
    }
}

updateSearchTicketsFromURL();

class AdminPanelSearchTickets extends React.Component {

    render() {
        const { listConfig, error } = this.props;

        return (
            <div className="admin-panel-search-tickets">
                <div className="admin-panel-search-tickets__container">
                    <Header
                        className="admin-panel-search-tickets__container__header"
                        title={listConfig.title !== undefined ? listConfig.title : i18n('SEARCH_TICKETS')}
                        description={i18n('SEARCH_TICKETS_DESCRIPTION')} />
                    <Button
                        className="admin-panel-search-tickets__container__show-filters-button"
                        size="auto"
                        type="tertiary"
                        onClick={this.onChangeShowFilters.bind(this)}>
                            <Icon name="filter" />
                    </Button>
                </div>
                <TicketQueryFilters />
                {
                    error ?
                        <Message showCloseButton={false} type="error">{i18n('ERROR_RETRIEVING_TICKETS')}</Message> :
                        <TicketQueryList onChangeOrderBy={this.onChangeOrderBy.bind(this)} />
                }
            </div>
        );
    }

    onChangeOrderBy(value) {
        const {
            listConfig,
            dispatch
        } = this.props;
        const orderBy = listConfig.filters.orderBy ? JSON.parse(listConfig.filters.orderBy) : {value: ""};
        const newValue = value;
        let newOrderBy = {};
        let newAsc = 0;

        if(value === orderBy.value) {
            newAsc = orderBy.asc === 0 ? 1 : 0;
        }
        newOrderBy = JSON.stringify({"value": newValue, "asc": newAsc});

        dispatch(searchFiltersActions.changeOrderBy({...listConfig.filters, orderBy: newOrderBy}));
    }

    onChangeShowFilters() {
        const {
            showFilters,
            dispatch
        } = this.props;
        dispatch(searchFiltersActions.changeShowFilters(!showFilters));
    }

}

export default connect((store) => {
    return {
        error: store.adminData.allTicketsError,
        listConfig: store.searchFilters.listConfig,
        ticketQueryListState: store.searchFilters.ticketQueryListState,
        showFilters: store.searchFilters.showFilters,
    };
})(AdminPanelSearchTickets);
