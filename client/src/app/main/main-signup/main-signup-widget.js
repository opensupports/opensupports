import React              from 'react';
import _                  from 'lodash';
import classNames         from 'classnames';

import i18n               from 'lib-app/i18n';
import API                from 'lib-app/api-call';
import history            from 'lib-app/history';
import SessionStore from 'lib-app/session-store';

import Captcha            from 'app/main/captcha';
import SubmitButton       from 'core-components/submit-button';
import Message            from 'core-components/message';
import Form               from 'core-components/form';
import FormField          from 'core-components/form-field';
import Widget             from 'core-components/widget';
import Header             from 'core-components/header';

class MainSignUpWidget extends React.Component {

    static propTypes = {
        className: React.PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            email: null,
            customFields: null,
            showMessage: true,
            message: null
        };
    }

    componentDidMount() {
        if(!SessionStore.getItem('customFields')) {
            API.call({
                path: '/system/get-custom-fields',
                data: {}
            })
            .then(result => {
                SessionStore.storeCustomField(result.data);
                this.setState({
                    customFields: result.data
                });
            })
        } else {
            this.setState({
                customFields: SessionStore.getCustomFields()
            });
        }
    }

    render() {
        if(!this.state.customFields) return null;

        return (
            <Widget className={this.getClass()}>
                <Header title={i18n('SIGN_UP')} description={i18n('SIGN_UP_VIEW_DESCRIPTION')} />
                <Form {...this.getFormProps()}>
                    <div className="signup-widget__inputs">
                        <FormField {...this.getInputProps()} label={i18n('FULL_NAME')} name="name" validation="NAME" required />
                        <FormField {...this.getInputProps()} label={i18n('EMAIL')} name="email" validation="EMAIL" required />
                        <FormField {...this.getInputProps(true)} label={i18n('PASSWORD')} name="password" validation="PASSWORD" required />
                        <FormField {...this.getInputProps(true)} label={i18n('REPEAT_PASSWORD')} name="repeated-password" validation="REPEAT_PASSWORD" required />
                        {this.state.customFields.map(this.renderCustomField.bind(this))}
                    </div>
                    <div className="signup-widget__captcha">
                        <Captcha ref="captcha" />
                    </div>
                    <SubmitButton type="primary">{i18n('SIGN_UP')}</SubmitButton>
                </Form>

                {this.renderMessage()}
            </Widget>
        );
    }

    renderCustomField(customField, key) {
        if(customField.type === 'text') {
            return (
                <FormField {...this.getInputProps()}
                    name={`customfield_${customField.name}`}
                    key={key}
                    label={customField.name}
                    infoMessage={customField.description}
                    field="input" />
            );
        } else {
            const items = customField.options.map(option => ({content: option.name, value: option.name}));

            return (
                <FormField
                    name={`customfield_${customField.name}`}
                    key={key}
                    label={customField.name}
                    infoMessage={customField.description}
                    field="select"
                    fieldProps={{size: 'medium', items}} />
            );
        }
    }

    renderMessage() {
        const { message, showMessage } = this.state;

        switch (message) {
            case 'success':
                return (
                    <Message
                        showMessage={showMessage}
                        onCloseMessage={this.onCloseMessage.bind(this, "showMessage")}
                        type="success">
                            {i18n('SIGNUP_SUCCESS')}
                    </Message>
                );
            case 'fail':
                return (
                    <Message
                        showMessage={showMessage}
                        onCloseMessage={this.onCloseMessage.bind(this, "showMessage")}
                        type="error">
                            {i18n('EMAIL_EXISTS')}
                    </Message>
                );
            default:
                return null;
        }
    }

    getClass() {
        let classes = {
            'signup-widget': true,
            [this.props.className]: this.props.className
        };
        return classNames(classes);
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

            const form = _.clone(formState);

            this.state.customFields.forEach(customField => {
                if(customField.type === 'select') {
                    form[`customfield_${customField.name}`] = customField.options[form[`customfield_${customField.name}`]].name;
                }
            })

            API.call({
                path: '/user/signup',
                data: _.extend({captcha: captcha.getValue()}, form)
            }).then(this.onSignupSuccess.bind(this)).catch(this.onSignupFail.bind(this));
        }
    }

    onSignupSuccess() {
        this.setState({
            loading: false,
            message: 'success',
            showMessage: true
        }, () => {
            setTimeout(() => {history.push('/')}, 2000);
        });
    }

    onSignupFail() {
        this.setState({
            loading: false,
            message: 'fail',
            showMessage: true
        });
    }

    onCloseMessage(showMessage) {
        this.setState({
            [showMessage]: false
        });
    }
}

export default MainSignUpWidget;
