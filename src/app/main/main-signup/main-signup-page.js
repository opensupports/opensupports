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
                                <Input {...this.getInputProps()} label="Full Name" name="name"/>
                                <Input {...this.getInputProps()} label="Email Address" name="email"/>
                                <Input {...this.getInputProps()} label="Password" name="password" password/>
                                <Input {...this.getInputProps()} label="Repeat Password" name="repeated-password" password/>
                            </div>
                            <Button type="primary">SIGN UP</Button>
                        </Form>
                    </Widget>
                </WidgetTransition>
            </div>
        );
    },

    getInputProps() {
        return {
            inputType: 'secondary',
            className: 'signup-widget-input'
        }
    },

    handleLoginFormSubmit(formState) {
        UserActions.login(formState.email, formState.password);
    }
});

export default MainSignUpPageWidget;