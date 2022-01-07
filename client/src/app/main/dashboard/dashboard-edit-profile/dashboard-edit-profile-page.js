import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import API from 'lib-app/api-call';
import i18n from 'lib-app/i18n';
import { getCustomFieldParamName } from 'lib-core/APIUtils';

import SessionActions from 'actions/session-actions';
import AreYouSure from 'app-components/are-you-sure';

import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Message from 'core-components/message';

class DashboardEditProfilePage extends React.Component {

    static propTypes = {
        userCustomFields: React.PropTypes.object,
    };

    static defaultProps = {
        userCustomFields: {},
    };

    state = {
        loadingEmail: false,
        loadingPass: false,
        messageEmail: '',
        messagePass: '',
        customFields: [],
        customFieldsFrom: {},
        loadingCustomFields: false,
        showChangeEmailMessage: true,
        showChangePasswordMessage: true
    };

    componentDidMount() {
        this.retrieveCustomFields();
    }

    render() {
        return (
            <div className="edit-profile-page">
                <Header title={i18n('EDIT_PROFILE')} description={i18n('EDIT_PROFILE_VIEW_DESCRIPTION')} />
                {this.renderEditEmail()}
                {this.renderEditPassword()}
                {this.state.customFields.length ? this.renderCustomFields() : null}
            </div>
        );
    }

    renderEditEmail() {
        return (
            <div className="edit-profile-page__edit-email">
                <span className="separator" />
                <div className="edit-profile-page__title">{i18n('EDIT_EMAIL')}</div>
                <Form loading={this.state.loadingEmail} onSubmit={this.onSubmitEditEmail.bind(this)}>
                    <div className="edit-profile-page__change-email-container">
                        <FormField name="newEmail" label={i18n('NEW_EMAIL')} field="input" validation="EMAIL" fieldProps={{size: 'large'}} required />
                        <SubmitButton type="secondary">{i18n('CHANGE_EMAIL')}</SubmitButton>
                    </div>
                    {this.renderMessageEmail()}
                </Form>
            </div>
        );
    }

    renderEditPassword() {
        return (
            <div className="edit-profile-page__edit-password">
                <span className="separator" />
                <div className="edit-profile-page__title">{i18n('EDIT_PASSWORD')}</div>
                <Form loading={this.state.loadingPass} onSubmit={this.onSubmitEditPassword.bind(this)}>
                    <div className="edit-profile-page__change-password-container">
                        <div className="edit-profile-page__change-password-form-fields">
                            <FormField name="oldPassword" label={i18n('OLD_PASSWORD')} field="input" validation="PASSWORD" fieldProps={{password: true, size: 'large'}} required />
                            <FormField name="password" label={i18n('NEW_PASSWORD')} field="input" validation="PASSWORD" fieldProps={{password: true, size: 'large'}} required />
                            <FormField name="repeatNewPassword" label={i18n('REPEAT_NEW_PASSWORD')} field="input" validation="REPEAT_PASSWORD" fieldProps={{password: true, size: 'large'}} required />
                        </div>
                        <SubmitButton type="secondary">{i18n('CHANGE_PASSWORD')}</SubmitButton>
                    </div>
                    {this.renderMessagePass()}
                </Form>
            </div>
        );
    }

    renderCustomFields() {
        const {
            loadingCustomFields,
            customFieldsFrom,
            customFields
        } = this.state;

        return (
            <div className="edit-profile-page__edit-custom-field">
                <span className="separator" />
                <div className="edit-profile-page__title">{i18n('ADDITIONAL_FIELDS')}</div>
                <Form
                    className="edit-profile-page__edit-custom-field-form"
                    loading={loadingCustomFields}
                    values={customFieldsFrom}
                    onChange={form => this.setState({customFieldsFrom: form})}
                    onSubmit={this.onCustomFieldsSubmit.bind(this)}>
                        <div className="edit-profile-page__custom-fields">
                            {customFields.map(this.renderCustomField.bind(this))}
                        </div>
                        <div className="edit-profile-page__update-custom-fields-button-container">
                            <SubmitButton className="edit-profile-page__update-custom-fields-button" type="secondary">{i18n('UPDATE_CUSTOM_FIELDS')}</SubmitButton>
                        </div>
                </Form>
            </div>
        );
    }

    renderCustomField(customField, key) {
        const { type, name, description, options } = customField;

        if(type === 'text') {
            return (
                <div className="edit-profile-page__custom-field" key={key}>
                    <FormField name={name} label={name} infoMessage={description} field="input" fieldProps={{size: 'small'}} />
                </div>
            );
        } else {
            const items = options.map(option => ({content: option.name, value: option.name}));

            return (
                <div className="edit-profile-page__custom-field" key={key}>
                    <FormField name={name} label={name} infoMessage={description} field="select" fieldProps={{size: 'small', items}} />
                </div>
            );
        }
    }

    renderMessageEmail() {
        const { messageEmail, showChangeEmailMessage } = this.state;

        switch (messageEmail) {
            case 'success':
                return (
                    <Message
                        showMessage={showChangeEmailMessage}
                        onCloseMessage={this.onCloseMessage.bind(this, "showChangeEmailMessage")}
                        className="edit-profile-page__message"
                        type="success">
                            {i18n('EMAIL_CHANGED')}
                    </Message>
                );
            case 'fail':
                return (
                    <Message
                        showMessage={showChangeEmailMessage}
                        onCloseMessage={this.onCloseMessage.bind(this, "showChangeEmailMessage")}
                        className="edit-profile-page__message"
                        type="error">
                            {i18n('EMAIL_EXISTS')}
                    </Message>
                );
            default:
                return null;
        }
    }

    renderMessagePass() {
        const { messagePass, showChangePasswordMessage } = this.state;

        switch (messagePass) {
            case 'success':
                return (
                    <Message
                        showMessage={showChangePasswordMessage}
                        onCloseMessage={this.onCloseMessage.bind(this, "showChangePasswordMessage")}
                        className="edit-profile-page__message"
                        type="success">
                            {i18n('PASSWORD_CHANGED')}
                    </Message>
                );
            case 'fail':
                return (
                    <Message
                        showMessage={showChangePasswordMessage}
                        onCloseMessage={this.onCloseMessage.bind(this, "showChangePasswordMessage")}
                        className="edit-profile-page__message"
                        type="error">
                            {i18n('OLD_PASSWORD_INCORRECT')}
                    </Message>
                );
            default:
                return null;
        }
    }

    onCustomFieldsSubmit(form) {
        const {customFields} = this.state;
        const parsedFrom = {};

        customFields.forEach(customField => {
            const {
                type,
                name,
                options
            } = customField;

            if(type === 'select') {
                parsedFrom[getCustomFieldParamName(name)] = options[form[name]].name;
            } else {
                parsedFrom[getCustomFieldParamName(name)] = form[name];
            }
        });

        this.setState({
            loadingCustomFields: true,
        });

        API.call({
            path: '/user/edit-custom-fields',
            data: parsedFrom
        }).then(() => {
            this.setState({loadingCustomFields: false});
            this.props.dispatch(SessionActions.getUserData());
        });
    }

    onSubmitEditEmail(formState) {
        AreYouSure.openModal(i18n('EMAIL_WILL_CHANGE'), this.callEditEmailAPI.bind(this, formState));
    }

    onSubmitEditPassword(formState) {
        AreYouSure.openModal(i18n('PASSWORD_WILL_CHANGE'), this.callEditPassAPI.bind(this, formState));
    }

    callEditEmailAPI(formState){
        this.setState({
            loadingEmail: true
        });

        return API.call({
            path: "/user/edit-email",
            data: {
                newEmail: formState.newEmail
            }
        }).then(function () {
            this.setState({
                loadingEmail: false,
                messageEmail: "success",
                showChangeEmailMessage: true
            });
        }.bind(this)).catch(function (){
            this.setState({
                loadingEmail: false,
                messageEmail: 'fail',
                showChangeEmailMessage: true
            })
        }.bind(this));
    }

    callEditPassAPI(formState){
        this.setState({
            loadingPass: true
        });

        return API.call({
            path: "/user/edit-password",
            data: {
                oldPassword: formState.oldPassword,
                newPassword: formState.password
            }
        }).then(function () {
            this.setState({
                loadingPass: false,
                messagePass: "success",
                showChangePasswordMessage: true
            });
        }.bind(this)).catch(function (){
            this.setState({
                loadingPass: false,
                messagePass: 'fail',
                showChangePasswordMessage: true
            })
        }.bind(this));
    }

    retrieveCustomFields() {
        API.call({
            path: '/system/get-custom-fields',
            data: {}
        })
        .then(result => {
            const customFieldsFrom = {};
            const {userCustomFields} = this.props;

            result.data.forEach(customField => {
                const {
                    type,
                    name,
                    options
                } = customField;

                if(type === 'select') {
                    const index = _.indexOf(options.map(option => option.name), userCustomFields[name]);
                    customFieldsFrom[name] = ((index === -1) ? 0 : index);
                } else {
                    customFieldsFrom[name] = userCustomFields[name] || '';
                }
            });

            this.setState({
                customFields: result.data,
                customFieldsFrom,
            });
        });
    }

    onCloseMessage(showMessage) {
        this.setState({
            [showMessage]: false
        });
    }
}

export default connect((store) => {
    const userCustomFields = {};

    store.session.userCustomFields.forEach(customField => {
        userCustomFields[customField.customfield] = customField.value;
    });

    return {
        userCustomFields: userCustomFields || {},
    };
})(DashboardEditProfilePage);
