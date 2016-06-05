const React = require( 'react');
const classNames = require('classnames');

const UserActions = require('actions/user-actions');
const UserStore = require('stores/user-store');

const Button = require('core-components/button');
const Form = require('core-components/form');
const Input = require('core-components/input');
const Checkbox = require('core-components/checkbox');
const Widget = require('core-components/widget');
const WidgetTransition = require('core-components/widget-transition');

let MainHomePageLoginWidget = React.createClass({

    getInitialState() {
        return {
            sideToShow: 'front'
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
            <Widget className="main-home-page--widget" title="Login">
                <Form className="login-widget--form" onSubmit={this.handleLoginFormSubmit}>
                    <div className="login-widget--inputs">
                        <Input placeholder="email" name="email" className="login-widget--input" validation="EMAIL" required/>
                        <Input placeholder="password" name="password" className="login-widget--input" password required/>
                        <Checkbox name="remember" label="Remember Me" className="login-widget--input"/>
                    </div>
                    <div className="login-widget--submit-button">
                        <Button type="primary">LOG IN</Button>
                    </div>
                </Form>
                <Button className="login-widget--forgot-password" type="link" onClick={this.handleForgetPasswordClick}>
                    {'Forgot your password?'}
                </Button>
            </Widget>
        );
    },

    renderPasswordRecovery() {
        return (
            <Widget className="main-home-page--widget main-home-page--password-widget" title="Password Recovery">
                <Form className="login-widget--form" onSubmit={this.handleSubmit}>
                    <div className="login-widget--inputs">
                        <Input placeholder="email" name="email" className="login-widget--input" validation="EMAIL"/>
                    </div>
                    <div className="login-widget--submit-button">
                        <Button type="primary">Recover my password</Button>
                    </div>
                </Form>
                <Button className="login-widget--forgot-password" type="link" onClick={this.handleBackToLoginClick}>
                    {'Back to login form'}
                </Button>
            </Widget>
        );
    },

    handleLoginFormSubmit(formState) {
        console.log(formState);
        UserActions.login(formState);
    },

    handleForgetPasswordClick() {
        this.setState({
            sideToShow: 'back'
        });
    },

    handleBackToLoginClick() {
        this.setState({
            sideToShow: 'front'
        });
    }
});

export default MainHomePageLoginWidget;
