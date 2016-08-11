import React              from 'react';
import ReCAPTCHA          from 'react-google-recaptcha';

import i18n               from 'lib-app/i18n';
import API                from 'lib-app/api-call';

import SubmitButton       from 'core-components/submit-button';
import Message            from 'core-components/message';
import Form               from 'core-components/form';
import Input              from 'core-components/input';
import Widget             from 'core-components/widget';


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
                <Widget className="signup-widget col-md-6 col-md-offset-3" title="Register">
                    <Form {...this.getFormProps()}>
                        <div className="signup-widget__inputs">
                            <Input {...this.getInputProps()} label="Full Name" name="name" validation="NAME" required/>
                            <Input {...this.getInputProps()} label="Email Address" name="email" validation="EMAIL" required/>
                            <Input {...this.getInputProps()} label="Password" name="password" password validation="PASSWORD" required/>
                            <Input {...this.getInputProps()} label="Repeat Password" name="repeated-password" password validation="REPEAT_PASSWORD" required/>
                        </div>
                        <div className="signup-widget__captcha">
                            <ReCAPTCHA sitekey="6LfM5CYTAAAAAGLz6ctpf-hchX2_l0Ge-Bn-n8wS" onChange={function () {}}/>
                        </div>
                        <SubmitButton type="primary">SIGN UP</SubmitButton>
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
            onSubmit: this.onLoginFormSubmit.bind(this)
        };
    }

    getInputProps() {
        return {
            inputType: 'secondary',
            className: 'signup-widget__input'
        };
    }

    onLoginFormSubmit(formState) {
        this.setState({
            loading: true
        });

        API.call({
            path: '/user/signup',
            data: formState
        }).then(this.onSignupSuccess.bind(this)).catch(this.onSignupFail.bind(this));
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