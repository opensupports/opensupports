import React from 'react';
import _ from 'lodash';

import store from 'app/store';
import SessionActions from 'actions/session-actions';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import TicketViewer from 'app-components/ticket-viewer';
import Loading from 'core-components/loading';
import Message from 'core-components/message';

class DashboardTicketPage extends React.Component {

    state = {
        error: null,
        ticket: null,
        showErrorMessage: true
    };

    componentDidMount() {
        this.retrieveTicketData();
    }

    render() {
        const { ticket, error } = this.state;

        return (
            <div className="dashboard-ticket-page">
                {(ticket || error) ? this.renderContent() : <Loading className="dashboard-ticket-page__loading" backgrounded/>}
            </div>
        );
    }

    renderContent() {
        const { ticket, error, showErrorMessage } = this.state;

        if(error) {
            return (
                <Message showMessage={showErrorMessage} onCloseMessage={this.onCloseMessage.bind(this, "showErrorMessage")} type="error">
                    {i18n(error)}
                </Message>
            );
        } else {
            return (
                <TicketViewer ticket={ticket} onChange={this.retrieveTicketData.bind(this)}/>
            );
        }

    }

    retrieveTicketData() {
        API.call({
            path: '/ticket/get',
            data: {
                ticketNumber: this.props.params.ticketNumber,
            }
        })
        .then(result => {
            const ticket = result.data
            this.setState({ticket, error: null})

            if(ticket.unread) {
                API.call({
                    path: '/ticket/seen',
                    data: {
                        ticketNumber: ticket.ticketNumber
                    }
                }).then(() => {
                    this.retrieveUserData();
                });
            }
        })
        .catch(result => this.setState({error: result.message, showErrorMessage: true}));
    }

    retrieveUserData() {
        store.dispatch(SessionActions.getUserData());
    }

    onCloseMessage(showMessage) {
        this.setState({
            [showMessage]: false
        });
    }
}

export default DashboardTicketPage;
