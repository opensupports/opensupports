import React              from 'react';
import ReactDOM           from 'react-dom';

import Widget             from 'core-components/widget';
import MainSignUpWidget   from 'app/main/main-signup/main-signup-widget';

class MainSignUpPage extends React.Component {

    render() {
        return (
            <div className="main-signup-page">
                <MainSignUpWidget {...this.props} className="col-md-6 col-md-offset-3" />
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

export default MainSignUpPage;
