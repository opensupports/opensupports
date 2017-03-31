import React              from 'react';
import ReactDOM           from 'react-dom';
import _                  from 'lodash';

import i18n               from 'lib-app/i18n';
import API                from 'lib-app/api-call';

import Captcha            from 'app/main/captcha';
import SubmitButton       from 'core-components/submit-button';
import Message            from 'core-components/message';
import Form               from 'core-components/form';
import FormField          from 'core-components/form-field';
import Widget             from 'core-components/widget';
import Header             from 'core-components/header';

class MainSignUpPageWidget extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            email: null
        };
    }

    render() {
        return (
            <div className="main-signup-page">
                <Widget className="signup-widget col-md-6 col-md-offset-3">
                    <Header title={i18n('SIGN_UP')} description={i18n('SIGN_UP_VIEW_DESCRIPTION')} />
                    <Form {...this.getFormProps()}>
                        <div className="signup-widget__inputs">
                            <FormField {...this.getInputProps()} label={i18n('FULL_NAME')} name="name" validation="NAME" required/>
                            <FormField {...this.getInputProps()} label={i18n('EMAIL')} name="email" validation="EMAIL" required/>
                            <FormField {...this.getInputProps(true)} label={i18n('PASSWORD')} name="password" validation="PASSWORD" required/>
                            <FormField {...this.getInputProps(true)} label={i18n('REPEAT_PASSWORD')} name="repeated-password" validation="REPEAT_PASSWORD" required/>
                        </div>
                        <div className="signup-widget__captcha">
                            <Captcha ref="captcha"/>
                        </div>
                        <SubmitButton type="primary">{i18n('SIGN_UP')}</SubmitButton>
                    </Form>

                    {this.renderMessage()}
                </Widget>
            </div>
        );
    }
    
    renderMessage() {
        switch (this.state.message) {
            case 'success':
                return <Message type="success">{i18n('SIGNUP_SUCCESS')}</Message>;
            case 'fail':
                return <Message type="error">{i18n('EMAIL_EXISTS')}</Message>;
            default:
                return null;
        }
    }

    getFormProps() {
        return {
            loading: this.state.loading,
            className: 'signup-widget__form',
            onSubmit: this.onSignupFormSubmit.bind(this)
        };
    }

    getInputProps(password) {
        return {
            className: 'signup-widget__input',
            fieldProps: {
                size: 'medium',
                password: password
            }
        };
    }

    onSignupFormSubmit(formState) {
        const captcha = this.refs.captcha.getWrappedInstance();

        if (!captcha.getValue()) {
            captcha.focus();
        } else {
            this.setState({
                loading: true
            });

            API.call({
                path: '/user/signup',
                data: _.extend({captcha: captcha.getValue()}, formState)
            }).then(this.onSignupSuccess.bind(this)).catch(this.onSignupFail.bind(this));
        }
    }

    onSignupSuccess() {
        this.setState({
            loading: false,
            message: 'success'
        });
    }

    onSignupFail() {
        this.setState({
            loading: false,
            message: 'fail'
        });
    }
}

export default MainSignUpPageWidget;