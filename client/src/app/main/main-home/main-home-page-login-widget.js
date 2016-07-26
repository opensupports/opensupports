const React = require('react');
const ReactDOM = require('react-dom');
const Reflux = require('reflux');
const _ = require('lodash');
const classNames = require('classnames');

const UserActions = require('actions/user-actions');
const UserStore = require('stores/user-store');
const focus = require('lib-core/focus');

const Button = require('core-components/button');
const Form = require('core-components/form');
const Input = require('core-components/input');
const Checkbox = require('core-components/checkbox');
const Widget = require('core-components/widget');
const WidgetTransition = require('core-components/widget-transition');

let MainHomePageLoginWidget = React.createClass({
    
    mixins: [Reflux.listenTo(UserStore, 'onUserStoreChanged')],

    getInitialState() {
        return {
            sideToShow: 'front',
            loginFormErrors: {}
        };
    },

    render() {
        return (
            <WidgetTransition sideToShow={this.state.sideToShow} className={classNames('login-widget--container', this.props.className)}>
                {this.renderLogin()}
                {this.renderPasswordRecovery()}
            </WidgetTransition>
        );
    },

    renderLogin() {
        return (
            <Widget className="main-home-page--widget" title="Login" ref="loginWidget">
                <Form className="login-widget--form" ref="loginForm" onSubmit={this.handleLoginFormSubmit} errors={this.state.loginFormErrors} onValidateErrors={this.handleLoginFormErrorsValidation}>
                    <div className="login-widget--inputs">
                        <Input placeholder="email" name="email" className="login-widget--input" validation="EMAIL" required/>
                        <Input placeholder="password" name="password" className="login-widget--input" password required/>
                        <Checkbox name="remember" label="Remember Me" className="login-widget--input"/>
                    </div>
                    <div className="login-widget--submit-button">
                        <Button type="primary">LOG IN</Button>
                    </div>
                </Form>
                <Button className="login-widget--forgot-password" type="link" onClick={this.handleForgotPasswordClick} onMouseDown={(event) => {event.preventDefault()}}>
                    {'Forgot your password?'}
                </Button>
            </Widget>
        );
    },

    renderPasswordRecovery() {
        return (
            <Widget className="main-home-page--widget main-home-page--password-widget" title="Password Recovery" ref="recoverWidget">
                <Form className="login-widget--form" onSubmit={this.handleForgotPasswordSubmit}>
                    <div className="login-widget--inputs">
                        <Input placeholder="email" name="email" className="login-widget--input" validation="EMAIL"/>
                    </div>
                    <div className="login-widget--submit-button">
                        <Button type="primary">Recover my password</Button>
                    </div>
                </Form>
                <Button className="login-widget--forgot-password" type="link" onClick={this.handleBackToLoginClick} onMouseDown={(event) => {event.preventDefault()}}>
                    {'Back to login form'}
                </Button>
            </Widget>
        );
    },

    handleLoginFormSubmit(formState) {
        UserActions.login(formState);
    },

    handleForgotPasswordSubmit() {

    },

    handleLoginFormErrorsValidation(errors) {
        this.setState({
            loginFormErrors: errors
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
                    password: 'Password does not match'
                }
            }, function () {
                this.refs.loginForm.refs.password.focus()
            }.bind(this));
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
