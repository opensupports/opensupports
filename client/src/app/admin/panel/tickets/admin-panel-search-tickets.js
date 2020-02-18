import React from 'react';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';

import TicketQueryList from 'app-components/ticket-query-list';

import Header from 'core-components/header';
import Message from 'core-components/message';
import TicketQueryFilters from 'app-components/ticket-query-filters';
import SearchFiltersActions from 'actions/search-filters-actions';

class AdminPanelSearchTickets extends React.Component {

    render() {
        const { listDataState } = this.props;
        return (
            <div className="admin-panel-all-tickets">
                <Header
                    title={listDataState.title !== undefined ? listDataState.title : i18n('CUSTOM_LIST')}
                    description={i18n('SEARCH_TICKETS_DESCRIPTION')} />
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
        const { listDataState, } = this.props;
        let orderBy = listDataState.filters.orderBy ? JSON.parse(listDataState.filters.orderBy) : {value: ""};
        let newOrderBy = {};
        let newAsc = 0;
        let newValue = value;

        if(value === orderBy.value) {
            newAsc = orderBy.asc === 0 ? 1 : 0;
        }

        newOrderBy = JSON.stringify({"value": newValue, "asc": newAsc});
        this.props.dispatch(SearchFiltersActions.changeFilters({
            ...listDataState,
            filters: {
                ...listDataState.filters,
                orderBy: newOrderBy
            }
        }));
    }
}

export default connect((store) => {
    return {
        error: store.adminData.allTicketsError,
        listDataState: store.searchFilters.listData
    };
})(AdminPanelSearchTickets);
