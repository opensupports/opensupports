import React              from 'react';
import {ListenerMixin}    from 'reflux';
import ReCAPTCHA          from 'react-google-recaptcha';

import UserActions        from 'actions/user-actions';
import UserStore          from 'stores/user-store';

import Button             from 'core-components/button';
import Form               from 'core-components/form';
import Input              from 'core-components/input';
import Widget             from 'core-components/widget';
import WidgetTransition   from 'core-components/widget-transition';

const CommonActions = require('actions/common-actions');

let MainSignUpPageWidget = React.createClass({

    componentDidMount() {
        if (UserStore.isLoggedIn()) {
            CommonActions.logged();
        }
    },

    render() {
        return (
            <div className="main-signup-page">
                <WidgetTransition sideToShow="front" className="main-signup-page__widget-container col-md-4 col-md-offset-4">
                    <Widget className="signup-widget" title="Register">
                        <Form className="signup-widget__form" onSubmit={this.handleLoginFormSubmit}>
                            <div className="signup-widget__inputs">
                                <Input {...this.getInputProps()} label="Full Name" name="name" validation="NAME" required/>
                                <Input {...this.getInputProps()} label="Email Address" name="email" validation="EMAIL" required/>
                                <Input {...this.getInputProps()} label="Password" name="password" password validation="PASSWORD" required/>
                                <Input {...this.getInputProps()} label="Repeat Password" name="repeated-password" password validation="REPEAT_PASSWORD" required/>
                            </div>
                            <div className="signup-widget__captcha">
                                <ReCAPTCHA sitekey="6LfM5CYTAAAAAGLz6ctpf-hchX2_l0Ge-Bn-n8wS" onChange={function () {}}/>
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
            className: 'signup-widget__input'
        }
    },

    handleLoginFormSubmit(formState) {
        UserActions.login(formState.email, formState.password);
    }
});

export default MainSignUpPageWidget;