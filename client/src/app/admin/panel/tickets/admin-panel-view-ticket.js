import React from 'react';
import _ from 'lodash';
import {connect}  from 'react-redux';

import API from 'lib-app/api-call';
import i18n from 'lib-app/i18n';
import SessionStore from 'lib-app/session-store';

import TicketViewer from 'app-components/ticket-viewer';
import Loading from 'core-components/loading';
import Header from 'core-components/header';

class AdminPanelViewTicket extends React.Component {

    static propTypes = {
        avoidSeen: React.PropTypes.bool,
        onRetrieveFail: React.PropTypes.func,
        assignmentAllowed: React.PropTypes.bool,
        editable: React.PropTypes.bool,
    };

    static defaultProps = {
        avoidSeen: false,
        assignmentAllowed: true,
        editable: true,
    };

    state = {
        loading: true,
        ticket: {}
    };

    componentDidMount() {
        this.retrieveTicket();
    }

    render() {
        return (
            <div className="admin-panel-view-ticket">
                <Header title={i18n('VIEW_TICKET')} description={i18n('TICKET_VIEW_DESCRIPTION')} />
                {(this.state.loading) ? this.renderLoading() : this.renderView()}
            </div>
        );
    }

    renderLoading() {
        return (
            <div className="admin-panel-view-ticket__loading">
                <Loading size="large" />
            </div>
        )
    };

    renderView() {
        return (_.isEmpty(this.state.ticket)) ? this.renderNoPermissionError() : this.renderTicketView();
    }

    renderNoPermissionError() {
        return (
            <div className="admin-panel-view-ticket__error">
                {i18n('NO_PERMISSION')}
            </div>
        );
    }

    renderTicketView() {
        return (
            <div className="admin-panel-view-ticket__ticket-view">
                <TicketViewer {...this.getTicketViewProps()} />
            </div>
        );
    }

    getTicketViewProps() {
        return {
            ticket: this.state.ticket,
            onChange: this.retrieveTicket.bind(this),
            assignmentAllowed: this.props.assignmentAllowed,
            customResponses: this.props.customResponses,
            editable: this.props.editable,
        };
    }

    retrieveTicket() {
        API.call({
            path: '/ticket/get',
            data: {
                ticketNumber: this.props.params.ticketNumber
            }
        }).then(this.onRetrieveSuccess.bind(this)).catch(this.onRetrieveFail.bind(this))
    }

    onRetrieveSuccess(result) {
        this.setState({
            loading: false,
            ticket: result.data
        });

        if(!this.props.avoidSeen) {
            API.call({
                path: '/ticket/seen',
                data: {
                    ticketNumber: this.props.params.ticketNumber
                }
            });
        }
    }

    onRetrieveFail() {
        this.setState({
            loading: false,
            ticket: {}
        });

        if(this.props.onRetrieveFail) {
            this.props.onRetrieveFail();
        }
    }
}

export default connect((store) => {
    return {
        customResponses: store.adminData.customResponses
    };
})(AdminPanelViewTicket);
