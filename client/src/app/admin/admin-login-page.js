import React from 'react';
import _ from 'lodash';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';
import SessionActions from 'actions/session-actions';

import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Message from 'core-components/message';
import Widget from 'core-components/widget';

class AdminLoginPage extends React.Component {
    render() {
        return (
            <div className="admin-login-page">
                <Widget className="admin-login-page__content">
                    <div className="admin-login-page__image"><img width="100%" src={API.getURL() + '/images/logo.png'} alt="OpenSupports Admin Panel"/></div>
                    <div className="admin-login-page__login-form">
                        <Form onSubmit={this.onSubmit.bind(this)} loading={this.props.session.pending}>
                            <FormField name="email" label={i18n('EMAIL')} field="input" validation="EMAIL" fieldProps={{size:'large'}} required />
                            <FormField name="password" label={i18n('PASSWORD')} field="input" fieldProps={{password:true, size:'large'}} />
                            <SubmitButton>{i18n('LOG_IN')}</SubmitButton>
                        </Form>
                    </div>
                    {this.renderMessage()}
                </Widget>
            </div>
        );
    }

    renderMessage() {
        let message = null;

        if(this.props.session.failed) {
            message = (
                <Message className="admin-login-page__error" type="error">
                    {i18n('EMAIL_OR_PASSWORD')}
                </Message>
            );
        }

        return message;
    }

    onSubmit(formState) {
        this.props.dispatch(SessionActions.login(_.extend({}, formState, {
            staff: true
        })));
    }
}

export default connect((store) => {
    return {
        session: store.session
    };
})(AdminLoginPage);
