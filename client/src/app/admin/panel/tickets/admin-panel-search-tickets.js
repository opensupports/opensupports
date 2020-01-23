import React from 'react';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';

import TicketQueryList from 'app-components/ticket-query-list';

import Header from 'core-components/header';
import Message from 'core-components/message';
import TicketQueryFilters from 'app-components/ticket-query-filters';

class AdminPanelSearchTickets extends React.Component {

    state = {
        filters: {
            closed: undefined,
            tags: "[]",
            page: 1,
        },
    }

    render() {
        return (
            <div className="admin-panel-all-tickets">
                <Header title={i18n('ALL_TICKETS')} description={i18n('SEARCH_TICKETS_DESCRIPTION')} />
                <TicketQueryFilters
                    defaultValue={this.state.filters}
                    onChange={filters => this.onChangeFilters(filters)} />
                {(this.props.error) ? <Message type="error">{i18n('ERROR_RETRIEVING_TICKETS')}</Message> : <TicketQueryList customList={this.getFilters()}/>}
            </div>
        );
    }

    getFilters() {
        //let customList = (window.customTicketList && window.customTicketList[this.props.location.query.custom*1]) ? window.customTicketList[this.props.location.query.custom*1] : null
        let customList = {filters: this.state.filters,};
        //console.log("customList: ", customList);
        return {
            ...customList
        };
    }

    onChangeFilters(filters) {
        this.setState({
            filters: filters,
        });
    }
}

export default connect((store) => {
    return {
        error: store.adminData.allTicketsError
    };
})(AdminPanelSearchTickets);
