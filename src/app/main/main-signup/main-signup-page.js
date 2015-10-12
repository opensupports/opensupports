import React              from 'react/addons';
import {ListenerMixin}    from 'reflux';

import UserActions        from 'actions/user-actions';
import UserStore          from 'stores/user-store';

import Button             from 'core-components/button';
import Form               from 'core-components/form';
import Input              from 'core-components/input';
import Widget             from 'core-components/widget';
import WidgetTransition   from 'core-components/widget-transition';

var MainSignUpPageWidget = React.createClass({

    render() {
        return (
            <div className="main-signup-page">
                <WidgetTransition sideToShow="front" className="main-signup-page--widget-container">
                    <Widget className="signup-widget" title="Register">
                        <Form className="signup-widget--form" onSubmit={this.handleLoginFormSubmit}>
                            <div className="signup-widget--inputs">
                                <Input placeholder="Full Name..." name="name" className="signup-widget--input"/>
                                <Input placeholder="Email Address..." name="email" className="signup-widget--input"/>
                                <Input placeholder="Password..." name="password" type="password" className="signup-widget--input"/>
                                <Input placeholder="Repeat Password..." name="repeated-password" type="password" className="signup-widget--input"/>
                            </div>
                            <Button type="primary">SIGN UP</Button>
                        </Form>
                    </Widget>
                </WidgetTransition>
            </div>
        );
    },

    handleLoginFormSubmit(formState) {
        UserActions.login(formState.email, formState.password);
    }
});

export default MainSignUpPageWidget;