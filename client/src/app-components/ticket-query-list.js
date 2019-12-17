import React from 'react';
import _ from 'lodash';

import API from 'lib-app/api-call';
import i18n from 'lib-app/i18n';
import {connect}  from 'react-redux';

import TicketList from 'app-components/ticket-list';
import Message from 'core-components/message';

class TicketQueryList extends React.Component {

    state = {
        tickets: [],
        page: 1,
        pages: 0,
        error: null,
        loading: true
    };

    componentDidMount() {
        this.getTickets();
    }

    render() {
        return (
            <div>
                {(this.state.error) ? <Message type="error">{i18n('ERROR_RETRIEVING_TICKETS')}</Message> : <TicketList {...this.getTicketListProps()}/>}
            </div>
        );
    }

    getTickets() {
        this.setState({
            loading:true
        })
        API.call({
            path: '/ticket/search',
            data: {
                page : this.state.page,
                ...this.props.filters
            }
        }).then((result) => {
            this.setState({
                tickets: result.data.tickets,
                page: result.data.page,
                pages: result.data.pages,
                error: null,
                loading: false
            })
        }).catch((result) => this.setState({
            loading: false,
            error: result.message
        }));

    }

    onPageChange(event) {
        this.setState({page: event.target.value}, () => this.getTickets());
    }

    getTicketListProps () {
        const {page,pages,loading,tickets} = this.state;
        return {
            userId: this.props.userId,
            ticketPath: '/admin/panel/tickets/view-ticket/',
            tickets,
            page,
            pages,
            loading,
            type: 'secondary',
            showDepartmentDropdown: false,
            closedTicketsShown: false,
            onPageChange:this.onPageChange.bind(this)
        };
    }

}

export default connect((store) => {
    return {
        userId: store.session.userId
    };
})(TicketQueryList);
