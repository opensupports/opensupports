import React from 'react';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';

import TicketQueryList from 'app-components/ticket-query-list';

import Header from 'core-components/header';
import Message from 'core-components/message';

class AdminPanelSearchTickets extends React.Component {

    render() {
        return (
            <div className="admin-panel-all-tickets">
                <Header title={i18n('ALL_TICKETS')} description={i18n('SEARCH_TICKETS_DESCRIPTION')} />
                {(this.props.error) ? <Message type="error">{i18n('ERROR_RETRIEVING_TICKETS')}</Message> : <TicketQueryList filters ={this.getFilters()}/>}
            </div>
        );
    }

    getFilters() {
        return {
        };
    }
}

export default connect((store) => {
    return {
        error: store.adminData.allTicketsError
    };
})(AdminPanelSearchTickets);
