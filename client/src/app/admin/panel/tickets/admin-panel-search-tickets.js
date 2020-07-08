import React from 'react';
import {connect}  from 'react-redux';
import queryString from 'query-string';

import i18n from 'lib-app/i18n';

import TicketQueryList from 'app-components/ticket-query-list';
import AdminDataActions from 'actions/admin-data-actions';
import searchTicketsUtils from '../../../../lib-app/search-tickets-utils';
import searchFiltersActions from '../../../../actions/search-filters-actions';
import history from 'lib-app/history';

import Header from 'core-components/header';
import Message from 'core-components/message';
import TicketQueryFilters from 'app-components/ticket-query-filters';
import Icon from 'core-components/icon';
import Button from 'core-components/button';
import store from 'app/store';

const INITIAL_PAGE = 1;
const SEARCH_TICKETS_PATH = '/search-tickets';
const SEARCH_TICKETS_SEARCH = `?dateRange=${searchTicketsUtils.getDefaultDateRangeForFilters()}&page=${INITIAL_PAGE}`;
const SEARCH_TICKETS_CUSTOM_SEARCH = 'custom=';

function retrieveStaffMembers() {
    store.dispatch(AdminDataActions.retrieveStaffMembers());
}

function updateSearchTicketsFromURL() {
    const currentPathName = window.location.pathname;
    const currentSearch = window.location.search;
    const currentPath = `${currentPathName}${currentSearch}`;
    if(currentPath.includes(SEARCH_TICKETS_PATH)) {
        searchTicketsUtils.getFiltersFromParams().then((listConfig) => {
            const showFilters = (
                (currentSearch === SEARCH_TICKETS_SEARCH) ?
                    false :
                    currentSearch.includes(SEARCH_TICKETS_CUSTOM_SEARCH) ?
                        true :
                        undefined
            );
            if(showFilters !== undefined) store.dispatch(searchFiltersActions.changeShowFilters(showFilters));
            store.dispatch(searchFiltersActions.changeFilters(listConfig));
            store.dispatch(searchFiltersActions.retrieveSearchTickets(
                {
                    ...store.getState().searchFilters.ticketQueryListState,
                    page: (queryString.parse(currentSearch).page || INITIAL_PAGE)*1
                },
                searchTicketsUtils.prepareFiltersForAPI(listConfig.filters)
            ));
        });
        retrieveStaffMembers();
    }
}

history.listen(() => {
    store.dispatch(searchFiltersActions.setLoadingInTrue());
    updateSearchTicketsFromURL();
});

updateSearchTicketsFromURL();

class AdminPanelSearchTickets extends React.Component {

    render() {
        const { listConfig } = this.props;
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
                    (this.props.error) ?
                        <Message type="error">{i18n('ERROR_RETRIEVING_TICKETS')}</Message> :
                        <TicketQueryList
                            onChangeOrderBy={this.onChangeOrderBy.bind(this)} />
                }
            </div>
        );
    }

    onChangeOrderBy(value) {
        const {
            listConfig,
            ticketQueryListState,
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

        const newListConfig = {
            ...listConfig,
            filters: {
                ...listConfig.filters,
                orderBy: newOrderBy
            },
            hasAllAuthorsInfo: true
        };
        const currentPath = window.location.pathname;
        const urlQuery = searchTicketsUtils.getFiltersForURL(newListConfig.filters);

        if(!newListConfig.title) {
            (urlQuery && history.push(`${currentPath}${urlQuery}`))
        } else {
            dispatch(searchFiltersActions.changeFilters(newListConfig));
            dispatch(searchFiltersActions.retrieveSearchTickets(ticketQueryListState, newListConfig.filters));
        }
    }

    onChangeShowFilters() {
        const {
            showFilters,
            dispatch
        } = this.props;
        dispatch(searchFiltersActions.changeShowFilters(showFilters));
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
