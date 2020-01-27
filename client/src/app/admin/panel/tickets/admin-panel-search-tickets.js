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
        /*
        filters: {
            closed: undefined,
            tags: "[]",
            priority: undefined,
            departments: "[1]",
        },*/
    }

    render() {
        return (
            <div className="admin-panel-all-tickets">
                <Header title={this.getList().title} description={i18n('SEARCH_TICKETS_DESCRIPTION')} />
                <TicketQueryFilters
                    defaultValue={this.state.listData.filters}
                    onChange={filters => this.onChangeFilters(filters)} />
                {(this.props.error) ? <Message type="error">{i18n('ERROR_RETRIEVING_TICKETS')}</Message> : <TicketQueryList customList={this.state.listData.filters}/>}
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
                    closed: undefined,
                    tags: "[]",
                    priority: undefined,
                    departments: "[]",
                }
            };
        }
    }

    onChangeFilters(filters) {
        this.setState({
            listData: {
                ...listData,
                filters: filters,
            }
        });
    }
}

export default connect((store) => {
    return {
        error: store.adminData.allTicketsError
    };
})(AdminPanelSearchTickets);
