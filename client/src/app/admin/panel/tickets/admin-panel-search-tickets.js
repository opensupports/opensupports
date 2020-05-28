import React from 'react';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';

import TicketQueryList from 'app-components/ticket-query-list';
import AdminDataActions from 'actions/admin-data-actions';
import searchTicketsUtils from '../../../../lib-app/search-tickets-utils';
import searchFiltersActions from '../../../../actions/search-filters-actions';

import Header from 'core-components/header';
import Message from 'core-components/message';
import TicketQueryFilters from 'app-components/ticket-query-filters';
import Icon from 'core-components/icon';
import Button from 'core-components/button';

class AdminPanelSearchTickets extends React.Component {

    componentDidMount() {
        this.retrieveStaffMembers();
        if(this.props.isPreviousPathnameSearchTickets) {
            searchTicketsUtils.getFiltersFromParams().then(listConfig => {
                this.props.dispatch(searchFiltersActions.changeFilters(listConfig));
                this.getTickets(listConfig);
            });
        }
    }

    render() {
        const { listConfig } = this.props;
        return (
            <div className="admin-panel-all-tickets">
                <div className="admin-panel-all-tickets__container">
                    <Header
                        className="admin-panel-all-tickets__container__header"
                        title={listConfig.title !== undefined ? listConfig.title : i18n('CUSTOM_LIST')}
                        description={i18n('SEARCH_TICKETS_DESCRIPTION')} />
                    <Button
                        className="admin-panel-all-tickets__container__show-filters-button"
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

    getTickets(listConfig) {
        const {
            dispatch,
            ticketQueryListState,
        } = this.props;
        dispatch(searchFiltersActions.retrieveSearchTickets(
            ticketQueryListState,
            listConfig.filters
        ));
    }

    onChangeOrderBy(value) {
        const {
            listConfig,
            ticketQueryListState,
            dispatch
        } = this.props;
        let orderBy = listConfig.filters.orderBy ? JSON.parse(listConfig.filters.orderBy) : {value: ""};
        let newOrderBy = {};
        let newAsc = 0;
        let newValue = value;

        if(value === orderBy.value) {
            newAsc = orderBy.asc === 0 ? 1 : 0;
        }

        newOrderBy = JSON.stringify({"value": newValue, "asc": newAsc});
        dispatch(searchFiltersActions.changeFilters({
            ...listConfig,
            filters: {
                ...listConfig.filters,
                orderBy: newOrderBy
            },
            hasAllAuthorsInfo: true
        }));
        dispatch(searchFiltersActions.retrieveSearchTickets(ticketQueryListState, {...listConfig.filters, orderBy: newOrderBy}));
    }

    onChangeShowFilters() {
        const {
            showFilters,
            dispatch
        } = this.props;
        dispatch(searchFiltersActions.changeShowFilters(showFilters));
    }

    retrieveStaffMembers() {
        this.props.dispatch(AdminDataActions.retrieveStaffMembers());
    }

}

export default connect((store) => {
    return {
        error: store.adminData.allTicketsError,
        listConfig: store.searchFilters.listConfig,
        ticketQueryListState: store.searchFilters.ticketQueryListState,
        showFilters: store.searchFilters.showFilters,
        isPreviousPathnameSearchTickets: store.searchFilters.isPreviousPathnameSearchTickets
    };
})(AdminPanelSearchTickets);
