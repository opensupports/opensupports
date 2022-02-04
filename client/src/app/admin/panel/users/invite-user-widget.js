import React              from 'react';
import _                  from 'lodash';
import classNames         from 'classnames';

import i18n               from 'lib-app/i18n';
import API                from 'lib-app/api-call';

import Captcha            from 'app/main/captcha';
import SubmitButton       from 'core-components/submit-button';
import Message            from 'core-components/message';
import Form               from 'core-components/form';
import FormField          from 'core-components/form-field';
import Widget             from 'core-components/widget';
import Header             from 'core-components/header';
import Button from 'core-components/button';
import ModalContainer from 'app-components/modal-container';
import Loading from 'core-components/loading';

class InviteUserWidget extends React.Component {

    static propTypes = {
        onSuccess: React.PropTypes.func,
        className: React.PropTypes.string,
        onChangeMessage: React.PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            email: null,
            customFields: null,
            showMessage: true
        };
    }

    componentDidMount() {
        API.call({
            path: '/system/get-custom-fields',
            data: {}
        }).then(result => {
            this.setState({
                customFields: result.data
            });
        });
    }

    render() {
        if(!this.state.customFields) return this.renderLoading();

        return (
            <div className="invite-user-widget__modal-wrapper">
                <Widget className={this.getClass()}>
                    <Header title={i18n('INVITE_USER')} description={i18n('INVITE_USER_VIEW_DESCRIPTION')} />
                    <Form {...this.getFormProps()}>
                        <div className="invite-user-widget__inputs">
                            <FormField {...this.getInputProps()} label={i18n('FULL_NAME')} name="name" validation="NAME" required />
                            <FormField {...this.getInputProps()} label={i18n('EMAIL')} name="email" validation="EMAIL" required />
                            {this.state.customFields.map(this.renderCustomField.bind(this))}
                        </div>
                        <div className="invite-user-widget__captcha">
                            <Captcha ref="captcha" />
                        </div>
                        <div className="invite-user-widget__buttons-container">
                            <SubmitButton type="secondary">{i18n('INVITE_USER')}</SubmitButton>
                            <Button onClick={(e) => {e.preventDefault(); ModalContainer.closeModal();}} type="link">{i18n('CANCEL')}</Button>
                        </div>
                    </Form>
                    {this.renderMessage()}
                </Widget>
            </div>
        );
    }

    renderLoading() {
        return (
            <div className="invite-user-widget__loading">
                <Loading backgrounded size="large" />
            </div>
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
            case 'success': // TODO Remove this message case
                return (
                    <Message
                        showMessage={showMessage}
                        onCloseMessage={this.onCloseMessage.bind(this, "showMessage")}
                        className="invite-user-widget__success-message"
                        type="success">
                            {i18n('INVITE_USER_SUCCESS')}
                    </Message>
                );
            case 'fail':
                return (
                    <Message
                        showMessage={showMessage}
                        onCloseMessage={this.onCloseMessage.bind(this, "showMessage")}
                        className="invite-user-widget__error-message"
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
            'invite-user-widget': true,
            [this.props.className]: this.props.className
        };
        return classNames(classes);
    }

    getFormProps() {
        return {
            loading: this.state.loading,
            className: 'invite-user-widget__form',
            onSubmit: this.onInviteUserFormSubmit.bind(this)
        };
    }

    getInputProps(password) {
        return {
            className: 'invite-user-widget__input',
            fieldProps: {
                size: 'medium',
                password: password
            }
        };
    }

    onInviteUserFormSubmit(formState) {
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
                path: '/user/invite',
                data: _.extend({captcha: captcha.getValue()}, form)
            }).then(this.onInviteUserSuccess.bind(this)).catch(this.onInviteUserFail.bind(this));
        }
    }

    onInviteUserSuccess() {
        const { onSuccess, onChangeMessage } = this.props;
        const message = 'success';

        this.setState({
            loading: false,
            message,
            showMessage: true
        });

        onChangeMessage && onChangeMessage(message);
        onSuccess && onSuccess();
    }

    onInviteUserFail() {
        const { onChangeMessage } = this.props;
        const message = 'fail';

        this.setState({
            loading: false,
            message,
            showMessage: true
        });

        onChangeMessage && onChangeMessage(message);
    }

    onCloseMessage(showMessage) {
        this.setState({
            [showMessage]: false
        });
    }
}

export default InviteUserWidget;
