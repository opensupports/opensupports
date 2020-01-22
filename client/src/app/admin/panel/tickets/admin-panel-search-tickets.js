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
                <Header title={this.getList().title} description={i18n('SEARCH_TICKETS_DESCRIPTION')} />
                {(this.props.error) ? <Message type="error">{i18n('ERROR_RETRIEVING_TICKETS')}</Message> : <TicketQueryList customList ={this.getList().filters}/>}
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
                'filters' : []
            };
        }
    }
}

export default connect((store) => {
    return {
        error: store.adminData.allTicketsError
    };
})(AdminPanelSearchTickets);
