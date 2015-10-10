import React              from 'react/addons';
import {ListenerMixin}    from 'reflux';
import {Motion, spring}   from 'react-motion';

import UserActions        from 'actions/user-actions';
import UserStore          from 'stores/user-store';

import Form               from 'core-components/form';
import Widget             from 'core-components/widget';
import Input              from 'core-components/input';
import Button             from 'core-components/button';

var MainHomePageLoginWidget = React.createClass({

    getInitialState() {
        return {
            showed: 'login'
        };
    },

    getDefaultAnimation() {
        return {
            rotateY: -90
        };
    },

    render() {
        return (
            <Motion defaultStyle={this.getDefaultAnimation()} style={{ rotateY: (this.state.showed == 'login') ? spring(0, [100, 20]) : spring(180, [100, 20])}}>
                {(animation) => {
                    return (
                        <div className="main-home-page--widget-container">
                            {this.renderLogin(animation)}
                            {this.renderPasswordRecovery(animation)}
                        </div>
                    )
                }}
            </Motion>
        );
    },

    renderLogin(variants) {
        var loginStyle = {
            transform: `rotateY(${(variants.rotateY) ? variants.rotateY: 0}deg)`
        };

        return (
            <Widget className="main-home-page--widget" title="Login" style={loginStyle}>
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

    renderPasswordRecovery(variants) {
        var passwordRecoveryStyle = {
            transform: `rotateY(${-180+variants.rotateY}deg)`
        };

        return (
            <Widget className="main-home-page--widget main-home-page--password-widget" title="Password Recovery" style={passwordRecoveryStyle}>
                <Form className="login-widget--form" onSubmit={this.handleSubmit}>
                    <div className="login-widget--inputs">
                        <Input placeholder="email" name="email" className="login-widget--input"/>
                    </div>
                    <Button type="primary">Recover my password</Button>
                </Form>
            </Widget>
        );
    },

    handleLoginFormSubmit(formState) {
        UserActions.login(formState.email, formState.password);
    },

    handleForgetPasswordClick() {
        this.setState({
            showed: 'password'
        });
    }
});

export default MainHomePageLoginWidget;