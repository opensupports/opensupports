import React              from 'react/addons';
import {ListenerMixin}    from 'reflux';

import UserActions        from 'actions/user-actions';
import UserStore          from 'stores/user-store';

import Form               from 'core-components/form';
import Widget             from 'core-components/widget';
import Input              from 'core-components/input';
import Button             from 'core-components/button';


var MainHomePageLoginWidget = React.createClass({
    render() {
        return (
            <Widget className="main-home-page--widget" title="Login">
                <Form className="login-widget--form" onSubmit={this.handleSubmit}>
                    <div className="login-widget--inputs">
                        <Input placeholder="email" name="email" className="login-widget--input"/>
                        <Input placeholder="password" name="password" type="password" className="login-widget--input"/>
                    </div>
                    <Button type="primary">LOG IN</Button>
                </Form>
                <Button type="link">{'Forgot your password?'}</Button>
            </Widget>
        );
    },

    handleSubmit(formState) {
        UserActions.login(formState.email, formState.password);
    }
});

export default MainHomePageLoginWidget;