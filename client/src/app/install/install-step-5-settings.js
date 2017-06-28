import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux'

import history from 'lib-app/history';
import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import Button from 'core-components/button';
import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Message from 'core-components/message';

class InstallStep5Settings extends React.Component {

    state = {
        loading: false,
        smtpConnection: null,
        form: {},
        error: false,
        errorMessage: ''
    };

    render() {
        return (
            <div className="install-step-5">
                <Header title={i18n('STEP_TITLE', {title: i18n('SETTINGS'), current: 5, total: 7})} description={i18n('STEP_5_DESCRIPTION')}/>
                {this.renderMessage()}
                <Form loading={this.state.loading} onSubmit={this.onSubmit.bind(this)} value={this.state.form} onChange={(form) => this.setState({form})}>
                    <FormField name="title" label={i18n('TITLE')} fieldProps={{size: 'large'}} required/>
                    <FormField className="install-step-5__attachments-field" name="allow-attachments" label={i18n('ALLOW_FILE_ATTACHMENTS')} field="checkbox" fieldProps={{size: 'large'}}/>
                    <FormField name="no-reply-email" label={i18n('NOREPLY_EMAIL')} fieldProps={{size: 'large'}}/>
                    <div className="install-step-5__smtp-block">
                        <Header title={i18n('SMTP_SERVER')} description={i18n('SMTP_SERVER_DESCRIPTION')} />
                        <FormField name="smtp-host" label={i18n('SMTP_SERVER')} fieldProps={{size: 'large'}}/>
                        <FormField name="smtp-port" label={i18n('PORT')} fieldProps={{size: 'small'}}/>
                        <FormField name="smtp-user" label={i18n('SMTP_USER')} fieldProps={{size: 'large'}}/>
                        <FormField name="smtp-password" label={i18n('SMTP_PASSWORD')} fieldProps={{size: 'large', password: true}}/>
                        <Button className="install-step-5__test-connection" size="medium" onClick={this.onTestSMTPClick.bind(this)}>
                            {i18n('TEST_SMTP_CONNECTION')}
                        </Button>
                        {this.renderMessageSMTP()}
                    </div>
                    <div className="install-step-5__buttons">
                        <SubmitButton className="install-step-5__next" size="medium" type="secondary">{i18n('NEXT')}</SubmitButton>
                        <Button className="install-step-5__previous" size="medium" onClick={this.onPreviousClick.bind(this)}>{i18n('PREVIOUS')}</Button>
                    </div>
                </Form>
            </div>
        );
    }

    renderMessage() {
        let message = null;

        if(this.state.error) {
            message = (
                <Message className="install-step-5__message" type="error">
                    {i18n('ERROR_UPDATING_SETTINGS')}: {this.state.errorMessage}
                </Message>
            );
        }

        return message;
    }

    renderMessageSMTP() {
        let message = null;

        if(this.state.smtpConnection !== null) {
            if(this.state.smtpConnection) {
                message = (
                    <Message className="install-step-5__smtp-message" type="success">
                        {i18n('SMTP_CONNECTION_SUCCESS')}
                    </Message>
                );
            } else {
                message = (
                    <Message className="install-step-5__smtp-message" type="error">
                        {i18n('SMTP_CONNECTION_ERROR')}
                    </Message>
                );
            }
        }

        return message;
    }

    onTestSMTPClick(event) {
        event.preventDefault();

        API.call({
            path: '/system/test-smtp',
            data: this.state.form
        }).then(() => this.setState({smtpConnection: true}))
            .catch(() => this.setState({smtpConnection: false}));
    }

    onPreviousClick(event) {
        event.preventDefault();
        history.push('/install/step-4');
    }

    onSubmit(form) {
        this.setState({
            loading: true
        }, () => {
            API.call({
                path: '/system/init-settings',
                data: _.extend({}, form, {
                    'language': this.props.language,
                    'user-system-enabled': this.props['user-system-enabled'],
                    'registration': this.props['registration']
                })
            })
                .then(() => history.push('/install/step-6'))
                .catch(({message}) => this.setState({
                    loading: false,
                    error: true,
                    errorMessage: message
                }));
        });
    }
}

export default connect((store) => {
    return {
        'user-system-enabled': store.config['user-system-enabled'],
        'registration': store.config['registration'],
        language: store.config.language
    };
})(InstallStep5Settings);