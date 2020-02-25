import React from 'react';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';

import TicketQueryList from 'app-components/ticket-query-list';

import Header from 'core-components/header';
import Message from 'core-components/message';
import TicketQueryFilters from 'app-components/ticket-query-filters';
import SearchFiltersActions from 'actions/search-filters-actions';
import Icon from 'core-components/icon';
import Button from 'core-components/button';

class AdminPanelSearchTickets extends React.Component {

    render() {
        const { listDataState } = this.props;
        return (
            <div className="admin-panel-all-tickets">
                <div className="admin-panel-all-tickets__container">
                    <Header
                        className="admin-panel-all-tickets__container__header"
                        title={listDataState.title !== undefined ? listDataState.title : i18n('CUSTOM_LIST')}
                        description={i18n('SEARCH_TICKETS_DESCRIPTION')} />
                    <Button
                        className="admin-panel-all-tickets__container__show-filters-button"
                        size="auto"
                        type="tertiary"
                        onClick={this.onChangeShowFilters.bind(this)}>
                            <Icon name="filter" />
                    </Button>
                </div>
                <TicketQueryFilters filters={listDataState.filters} />
                {
                    (this.props.error) ?
                        <Message type="error">{i18n('ERROR_RETRIEVING_TICKETS')}</Message> :
                        <TicketQueryList
                            filters={listDataState.filters}
                            onChangeOrderBy={this.onChangeOrderBy.bind(this)} />
                }
            </div>
        );
    }

    onChangeOrderBy(value) {
        const {
            listDataState,
            dispatch
        } = this.props;
        let orderBy = listDataState.filters.orderBy ? JSON.parse(listDataState.filters.orderBy) : {value: ""};
        let newOrderBy = {};
        let newAsc = 0;
        let newValue = value;

        if(value === orderBy.value) {
            newAsc = orderBy.asc === 0 ? 1 : 0;
        }

        newOrderBy = JSON.stringify({"value": newValue, "asc": newAsc});
        dispatch(SearchFiltersActions.changeFilters({
            ...listDataState,
            filters: {
                ...listDataState.filters,
                orderBy: newOrderBy
            }
        }));
    }

    onChangeShowFilters() {
        const {
            showFilters,
            dispatch
        } = this.props;
        dispatch(SearchFiltersActions.changeShowFilters(showFilters));
    }

}

export default connect((store) => {
    return {
        error: store.adminData.allTicketsError,
        listDataState: store.searchFilters.listData,
        showFilters: store.searchFilters.showFilters
    };
})(AdminPanelSearchTickets);
