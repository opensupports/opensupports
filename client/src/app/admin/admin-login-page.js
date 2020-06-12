import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';
import SessionActions from 'actions/session-actions';

import PasswordRecovery from 'app-components/password-recovery.js';
import Button from 'core-components/button';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Message from 'core-components/message';
import Widget from 'core-components/widget';
import WidgetTransition from 'core-components/widget-transition';

class AdminLoginPage extends React.Component {

    state = {
        sideToShow: 'front',
        loginFormErrors: {},
        recoverFormErrors: {},
        recoverSent: false,
        loadingLogin: false,
        loadingRecover: false
    };

    componentDidUpdate(prevProps) {
        if (!prevProps.session.failed && this.props.session.failed) {
            this.refs.loginForm.refs.password.focus();
        }
    }

    render() {
        return (
            <div className="admin-login-page">
                <WidgetTransition sideToShow={this.state.sideToShow} className={classNames('admin-login-page__container', this.props.className)}>
                    {this.renderLogin()}
                    {this.renderPasswordRecovery()}
                </WidgetTransition>
            </div>
        );
    }

    renderLogin() {
        return (
            <div>
                <Widget className="admin-login-page__content">
                    <div className="admin-login-page__image"><img width="100%" src={API.getURL() + '/images/logo.png'} alt="OpenSupports Admin Panel" /></div>
                    <div className="admin-login-page__login-form">
                        <Form onSubmit={this.onLoginFormSubmit.bind(this)} loading={this.props.session.pending}>
                            <FormField name="email" label={i18n('EMAIL')} field="input" validation="EMAIL" fieldProps={{size:'large'}} required />
                            <FormField name="password" label={i18n('PASSWORD')} field="input" fieldProps={{password:true, size:'large'}} />
                            <SubmitButton>{i18n('LOG_IN')}</SubmitButton>
                        </Form>
                    </div>
                    {this.renderRecoverStatus()}
                    {this.renderErrorStatus()}
                <Button className="login-widget__forgot-password" type="link" onClick={this.onForgotPasswordClick.bind(this)} onMouseDown={(event) => {event.preventDefault()}}>
                    {i18n('FORGOT_PASSWORD')}
                </Button>
                </Widget>
            </div>
        );
    }

    renderPasswordRecovery() {
        return (
            <div>
                <PasswordRecovery recoverSent={this.state.recoverSent} formProps={this.getRecoverFormProps()} onBackToLoginClick={this.onBackToLoginClick.bind(this)} renderLogo={true} />
            </div>
        );
    }

    renderRecoverStatus() {
        let status = null;

        if (this.state.recoverSent) {
            status = (
                <Message className="admin-login-page__message" type="info" leftAligned>
                    {i18n('RECOVER_SENT')}
                </Message>
            );
        }

        return status;
    }

    renderErrorStatus() {
        let status = null;

        if (this.props.session.failed) {
            status = (
                <Message className="admin-login-page__error" type="error">
                    {i18n('EMAIL_OR_PASSWORD')}
                </Message>
            );
        }

        return status;
    }

    getLoginFormProps() {
        return {
            loading: this.props.session.pending,
            className: 'admin-login-page__form',
            ref: 'loginForm',
            onSubmit: this.onLoginFormSubmit.bind(this),
            errors: this.getLoginFormErrors(),
            onValidateErrors: this.onLoginFormErrorsValidation.bind(this)
        };
    }

    getRecoverFormProps() {
        return {
            loading: this.state.loadingRecover,
            className: 'admin-login-page__form',
            ref: 'recoverForm',
            onSubmit: this.onForgotPasswordSubmit.bind(this),
            errors: this.state.recoverFormErrors,
            onValidateErrors: this.onRecoverFormErrorsValidation.bind(this)
        };
    }

    getLoginFormErrors() {
        let errors = _.extend({}, this.state.loginFormErrors);

        if (this.props.session.failed) {
            if (this.props.session.failMessage === 'INVALID_CREDENTIALS') {
                errors.password = i18n('ERROR_PASSWORD');
            } else if (this.props.session.failMessage === 'UNVERIFIED_USER') {
                errors.email = i18n('UNVERIFIED_EMAIL');
            }
        }

        return errors;
    }

    onLoginFormSubmit(formState) {
        this.props.dispatch(SessionActions.login(_.extend({}, formState, {
            staff: true
        })));
    }

    onForgotPasswordSubmit(formState) {
        this.setState({
            loadingRecover: true,
            recoverSent: false
        });

        API.call({
            path: '/user/send-recover-password',
            data: _.extend({}, formState, {staff: true})
        }).then(this.onRecoverPasswordSent.bind(this)).catch(this.onRecoverPasswordFail.bind(this));
    }

    onLoginFormErrorsValidation(errors) {
        this.setState({
            loginFormErrors: errors
        });
    }

    onRecoverFormErrorsValidation(errors) {
        this.setState({
            recoverFormErrors: errors
        });
    }

    onForgotPasswordClick() {
        this.setState({
            sideToShow: 'back'
        });
    }

    onBackToLoginClick() {
        this.setState({
            sideToShow: 'front',
            recoverSent: false
        });
    }

    onRecoverPasswordSent() {
        this.setState({
            loadingRecover: false,
            recoverSent: true
        });
    }

    onRecoverPasswordFail() {
        this.setState({
            loadingRecover: false,
            recoverFormErrors: {
                email: i18n('EMAIL_NOT_EXIST')
            }
        }, function () {
            this.refs.recoverForm.refs.email.focus();
        }.bind(this));
    }
}

export default connect((store) => {
    return {
        session: store.session
    };
})(AdminLoginPage);
