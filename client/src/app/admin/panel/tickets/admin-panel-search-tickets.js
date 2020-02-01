import React from 'react';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';

import TicketQueryList from 'app-components/ticket-query-list';

import Header from 'core-components/header';
import Message from 'core-components/message';
import TicketQueryFilters from 'app-components/ticket-query-filters';

class AdminPanelSearchTickets extends React.Component {

    state = {
        listData: this.getList(),
    }

    render() {
        return (
            <div className="admin-panel-all-tickets">
                <Header title={this.getList().title} description={i18n('SEARCH_TICKETS_DESCRIPTION')} />
                <TicketQueryFilters
                    defaultValue={this.state.listData.filters}
                    onChange={filters => this.onChangeFilters(filters)} />
                {
                    (this.props.error) ?
                        <Message type="error">{i18n('ERROR_RETRIEVING_TICKETS')}</Message> :
                        <TicketQueryList
                            filters={this.state.listData.filters}
                            onChangeOrderBy={this.onChangeOrderBy.bind(this)} />
                }
            </div>
        );
    }

    getList() {
        if (
            window.customTicketList && 
            this.props.location.query.custom && 
            window.customTicketList[this.props.location.query.custom*1]
        ){ 
            return window.customTicketList[this.props.location.query.custom*1];
        } else {
            return {
                'title' : i18n('CUSTOM_LIST'),
                'filters' : {
                    query: "",
                    closed: undefined,
                    priority: undefined,
                    departments: "[]",
                    owners: "[]",
                    tags: "[]",
                    dateRange: undefined ,
                    orderBy: undefined
                }
            };
        }
    }

    onChangeFilters(filters) {
        this.setState({
            listData: {
                ...this.state.listData,
                filters: filters,
            }
        });
    }

    onChangeOrderBy(value) {
        const { listData, } = this.state;
        let orderBy = listData.filters.orderBy ? JSON.parse(listData.filters.orderBy) : {value: ""};
        let newOrderBy = {};
        let newAsc = 0;
        let newValue = value;

        if(value === orderBy.value) {
            newAsc = orderBy.asc === 0 ? 1 : 0;
        }

        newOrderBy = JSON.stringify({"value": newValue, "asc": newAsc});

        this.setState({
            listData: {
                ...this.state.listDate,
                filters: {...this.state.listData.filters, orderBy: newOrderBy}
            }
        });
    }
}

export default connect((store) => {
    return {
        error: store.adminData.allTicketsError
    };
})(AdminPanelSearchTickets);
