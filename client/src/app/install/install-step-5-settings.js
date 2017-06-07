import React from 'react';

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
        smtpConnection: null, // ad a message
        form: {},
        onFormChange: (form) => this.setState({form}),
        error: false,
        errorMessage: ''
    };

    render() {
        return (
            <div className="install-step-5">
                <Header title={i18n('STEP_TITLE', {title: i18n('INITIAL_SETTINGS'), current: 5, total: 7})} description={i18n('STEP_4_DESCRIPTION')}/>
                {this.renderMessage()}
                <Form loading={this.state.loading} onSubmit={this.onSubmit.bind(this)} value={this.state.form} onChange={this.onFormChange.bind(this)}>
                    <FormField name="title" label={i18n('TITLE')} fieldProps={{size: 'large'}} required/>
                    <FormField name="allow-attachments" label={i18n('ALLOW_FILE_ATTACHMENTS')} fieldProps={{size: 'large'}} infoMessage={i18n('LEFT_EMPTY_DATABASE')}/>
                    <FormField name="no-reply-email" label={i18n('NO_REPLY_EMAIL')} fieldProps={{size: 'large'}} required/>
                    <FormField name="smtp-host" label={i18n('SMTP_SERVER')} fieldProps={{size: 'large'}} required/>
                    <FormField name="smtp-port" label={i18n('SMTP_PORT')} fieldProps={{size: 'small'}} required/>
                    <FormField name="smtp-user" label={i18n('SMTP_USER')} fieldProps={{size: 'large'}} required/>
                    <FormField name="smtp-password" label={i18n('SMTP_PASSWORD')} fieldProps={{size: 'large', password: true}}/>
                    <Button className="install-step-5__test-connection" size="medium" onClick={this.onTestSMTPClick.bind(this)}>
                        {i18n('TEST_SMTP_CONNECTION')}
                    </Button>
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
                data: form // add step 4 to form
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

export default InstallStep5Settings;