import React      from 'react';
import ReactDOM   from 'react-dom';
import Reflux     from 'reflux';
import classNames from 'classnames';

import UserActions from 'actions/user-actions';
import UserStore   from 'stores/user-store';
import focus       from 'lib-core/focus';
import i18n        from 'lib-app/i18n';

import Button           from 'core-components/button';
import Form             from 'core-components/form';
import Input            from 'core-components/input';
import Checkbox         from 'core-components/checkbox';
import Widget           from 'core-components/widget';
import WidgetTransition from 'core-components/widget-transition';
import Message          from 'core-components/message';

let MainHomePageLoginWidget = React.createClass({
    
    mixins: [Reflux.listenTo(UserStore, 'onUserStoreChanged')],

    getInitialState() {
        return {
            sideToShow: 'front',
            loginFormErrors: {},
            recoverFormErrors: {},
            recoverSent: false
        };
    },

    render() {
        return (
            <WidgetTransition sideToShow={this.state.sideToShow} className={classNames('login-widget__container', this.props.className)}>
                {this.renderLogin()}
                {this.renderPasswordRecovery()}
            </WidgetTransition>
        );
    },

    renderLogin() {
        return (
            <Widget className="main-home-page__widget" title="Login" ref="loginWidget">
                <Form className="login-widget__form" ref="loginForm" onSubmit={this.handleLoginFormSubmit} errors={this.state.loginFormErrors} onValidateErrors={this.handleLoginFormErrorsValidation}>
                    <div className="login-widget__inputs">
                        <Input placeholder="email" name="email" className="login-widget__input" validation="EMAIL" required/>
                        <Input placeholder="password" name="password" className="login-widget__input" password required/>
                        <Checkbox name="remember" label="Remember Me" className="login-widget__input"/>
                    </div>
                    <div className="login-widget__submit-button">
                        <Button type="primary">LOG IN</Button>
                    </div>
                </Form>
                <Button className="login-widget__forgot-password" type="link" onClick={this.handleForgotPasswordClick} onMouseDown={(event) => {event.preventDefault()}}>
                    {i18n('FORGOT_PASSWORD')}
                </Button>
            </Widget>
        );
    },

    renderPasswordRecovery() {
        return (
            <Widget className="main-home-page__widget login-widget_password" title={i18n('RECOVER_PASSWORD')} ref="recoverWidget">
                <Form className="login-widget__form" ref="recoverForm" onSubmit={this.handleForgotPasswordSubmit} errors={this.state.recoverFormErrors}  onValidateErrors={this.handleRecoverFormErrorsValidation}>
                    <div className="login-widget__inputs">
                        <Input placeholder="email" name="email" className="login-widget__input" validation="EMAIL" required/>
                    </div>
                    <div className="login-widget__submit-button">
                        <Button type="primary">{i18n('RECOVER_PASSWORD')}</Button>
                    </div>
                </Form>
                <Button className="login-widget__forgot-password" type="link" onClick={this.handleBackToLoginClick} onMouseDown={(event) => {event.preventDefault()}}>
                    {i18n('BACK_LOGIN_FORM')}
                </Button>
                {this.renderRecoverStatus()}
            </Widget>
        );
    },

    renderRecoverStatus() {
        let status = null;

        if (this.state.recoverSent) {
            status = (
                <Message className="login-widget__message" type="info" leftAligned>
                    {i18n('RECOVER_SENT')}
                </Message>
            );
        }

        return status;
    },

    handleLoginFormSubmit(formState) {
        UserActions.login(formState);
    },

    handleForgotPasswordSubmit(formState) {
        UserActions.sendRecover(formState);
    },

    handleLoginFormErrorsValidation(errors) {
        this.setState({
            loginFormErrors: errors
        });
    },

    handleRecoverFormErrorsValidation(errors) {
        this.setState({
            recoverFormErrors: errors
        });
    },

    handleForgotPasswordClick() {
        this.setState({
            sideToShow: 'back'
        }, this.moveFocusToCurrentSide);
    },

    handleBackToLoginClick() {
        this.setState({
            sideToShow: 'front'
        }, this.moveFocusToCurrentSide);
    },
    
    onUserStoreChanged(event) {
        if (event === 'LOGIN_FAIL') {
            this.setState({
                loginFormErrors: {
                    password: i18n('ERROR_PASSWORD')
                }
            }, function () {
                this.refs.loginForm.refs.password.focus();
            }.bind(this));
        }

        if (event === 'SEND_RECOVER_FAIL') {
            this.setState({
                recoverFormErrors: {
                    email: i18n('EMAIL_NOT_EXIST')
                }
            }, function () {
                this.refs.recoverForm.refs.email.focus();
            }.bind(this));

        }

        if (event === 'SEND_RECOVER_SUCCESS') {
            this.setState({
                recoverSent: true
            });
        }
    },

    moveFocusToCurrentSide() {
        let currentWidget;
        let previousWidget;

        if (this.state.sideToShow === 'front') {
            currentWidget = ReactDOM.findDOMNode(this.refs.loginWidget);
            previousWidget = ReactDOM.findDOMNode(this.refs.recoverWidget);
        } else {
            currentWidget = ReactDOM.findDOMNode(this.refs.recoverWidget);
            previousWidget = ReactDOM.findDOMNode(this.refs.loginWidget);
        }

        if (focus.isActiveElementInsideDOMTree(previousWidget)) {
            focus.focusFirstInput(currentWidget);
        }
    }
});

export default MainHomePageLoginWidget;
