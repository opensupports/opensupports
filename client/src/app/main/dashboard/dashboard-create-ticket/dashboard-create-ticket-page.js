import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';
import queryString from 'query-string';

import history from 'lib-app/history';
import i18n from 'lib-app/i18n';

import CreateTicketForm from 'app/main/dashboard/dashboard-create-ticket/create-ticket-form';

import Widget from 'core-components/widget';
import Message from 'core-components/message';

class DashboardCreateTicketPage extends React.Component {

    static propTypes = {
        userSystemEnabled: React.PropTypes.bool
    };

    render() {
        let Wrapper = 'div';

        if((this.props.location.pathname === '/create-ticket')) {
            Wrapper = Widget;
        }

        return (
            <div className={this.getClass()}>
                <Wrapper className="dashboard-create-ticket-page__container">
                    {queryString.parse(window.location.search)["message"] ?
                        <Message className="dashboard-create-ticket-page__message" type="success">
                            {i18n('TICKET_NUMBER_SENT')}
                        </Message> :
                        null}
                    <div className={this.getCreateTicketFormClass()}>
                        <CreateTicketForm
                            userLogged={(this.props.location.pathname !== '/create-ticket')}
                            onSuccess={this.onCreateTicketSuccess.bind(this)} />
                    </div>
                </Wrapper>
            </div>
        );
    }

    onCreateTicketSuccess(message) {
        history.push(`${(this.props.location.pathname !== '/create-ticket') ? "/dashboard" : "/create-ticket"}?message=${message}`);
    }

    getClass() {
        let classes = {
            'dashboard-create-ticket-page': true,
            'dashboard-create-ticket-page_wrapped': (this.props.location.pathname === '/create-ticket'),
            'col-md-10 col-md-offset-1': !this.props.isLogged
        };

        return classNames(classes);
    }

    getCreateTicketFormClass() {
        let classes = {
            'dashboard-create-ticket-page__create-ticket-form': true,
            'dashboard-create-ticket-page__create-ticket-form__hidden': !!queryString.parse(window.location.search)["message"]
        };

        return classNames(classes);
    }
}

export default connect((store) => {
    return {
        isLogged: store.session.logged,
        config: store.config
    };
})(DashboardCreateTicketPage);
