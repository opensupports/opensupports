import React from 'react';

import API from 'lib-app/api-call';
import TicketViewer from 'app-components/ticket-viewer';
import Loading from 'core-components/loading';

class AdminPanelViewTicket extends React.Component {

    state = {
        loading: true,
        ticket: {}
    };

    render() {
        return (
            <div>
                {(this.state.loading) ? this.renderLoading() : this.renderView()}
            </div>
        );
    }

    renderLoading() {

    };

    renderView() {
        return (this.props.ticket) ? this.renderNotFoundError() : this.renderTicketView();
    }

    renderNotFoundError() {
        return (
            <div>

            </div>
        );
    }

    renderTicketView() {
        return (
            <div>

            </div>
        );
    }

    retrieveTicket() {
        this.setState({
            loading: true,
            ticket: {}
        });

        API.call({
            path: '/ticket/get',
            date: {
                ticketNumber: this.props.params.ticketNumber
            }
        }).then(this.onRetrieveSuccess.bind(this))
    }

    onRetrieveSuccess(result) {
        this.setState({
            loading: false,
            ticket: result.data
        });
    }
}

export default AdminPanelViewTicket;