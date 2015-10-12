import React              from 'react/addons';
import {ListenerMixin}    from 'reflux';

import UserActions        from 'actions/user-actions';
import UserStore          from 'stores/user-store';

import Button             from 'core-components/button';
import Form               from 'core-components/form';
import Input              from 'core-components/input';
import Widget             from 'core-components/widget';
import WidgetTransition   from 'core-components/widget-transition';

var MainHomePageLoginWidget = React.createClass({

    getInitialState() {
        return {
            sideToShow: 'front'
        };
    },

    render() {
        return (
            <WidgetTransition sideToShow={this.state.sideToShow} className="login-widget--container">
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
                        <Input placeholder="email" name="email" className="login-widget--input"/>
                        <Input placeholder="password" name="password" type="password" className="login-widget--input"/>
                    </div>
                    <Button type="primary">LOG IN</Button>
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
                        <Input placeholder="email" name="email" className="login-widget--input"/>
                    </div>
                    <Button type="primary">Recover my password</Button>
                </Form>
                <Button className="login-widget--forgot-password" type="link" onClick={this.handleBackToLoginClick}>
                    {'Back to login form'}
                </Button>
            </Widget>
        );
    },

    handleLoginFormSubmit(formState) {
        UserActions.login(formState.email, formState.password);
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