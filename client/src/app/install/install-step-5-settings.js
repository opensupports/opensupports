import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux'

import history from 'lib-app/history';
import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import PopupMessage from 'app-components/popup-message';
import Button from 'core-components/button';
import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Message from 'core-components/message';

class InstallStep5Settings extends React.Component {

    state = {
        loading: false,
        form: {},
        error: false,
        showErrorMessage: true,
        errorMessage: ''
    };

    render() {
        const {
            loading,
            form
        } = this.state;

        return (
            <div className="install-step-5">
                <Header title={i18n('STEP_TITLE', {title: i18n('SETTINGS'), current: 5, total: 6})} description={i18n('STEP_5_DESCRIPTION')} />
                {this.renderMessage()}
                <Form loading={loading} onSubmit={this.onSubmit.bind(this)} value={form} onChange={(form) => this.setState({form})}>
                    <FormField name="title" label={i18n('TITLE')} fieldProps={{size: 'large'}} required/>
                    <FormField className="install-step-5__attachments-field" name="allow-attachments" label={i18n('ALLOW_FILE_ATTACHMENTS')} field="checkbox" fieldProps={{size: 'large'}}/>
                    <FormField name="server-email" label={i18n('EMAIL_SERVER_ADDRESS')} fieldProps={{size: 'large'}} infoMessage={i18n('EMAIL_SERVER_ADDRESS_DESCRIPTION')}/>
                    <div className="install-step-5__smtp-block">
                        <Header title={i18n('SMTP_SERVER')} description={i18n('SMTP_SERVER_DESCRIPTION')} />
                        <FormField name="smtp-host" label={i18n('SMTP_SERVER')} fieldProps={{size: 'large'}}/>
                        <FormField name="smtp-user" label={i18n('SMTP_USER')} fieldProps={{size: 'large'}}/>
                        <FormField name="smtp-pass" label={i18n('SMTP_PASSWORD')} fieldProps={{size: 'large', password: true}}/>
                        <SubmitButton className="install-step-5__test-connection" size="medium" onClick={this.onTestSMTPClick.bind(this)} disabled={loading}>
                            {i18n('TEST_SMTP_CONNECTION')}
                        </SubmitButton>
                    </div>
                    <div className="install-step-5__buttons">
                        <Button
                            className="install-step-5__previous"
                            size="medium"
                            disabled={loading}
                            onClick={this.onPreviousClick.bind(this)}
                        >
                                {i18n('PREVIOUS')}
                        </Button>
                        <SubmitButton className="install-step-5__next" size="medium" type="secondary">
                                {i18n('NEXT')}
                        </SubmitButton>
                    </div>
                </Form>
            </div>
        );
    }

    renderMessage() {
        const { error, errorMessage, showErrorMessage } = this.state;

        return (
            error ?
                <Message
                    showMessage={showErrorMessage}
                    onCloseMessage={this.onCloseMessage.bind(this, "showErrorMessage")}
                    className="install-step-5__message"
                    type="error">
                        {i18n('ERROR_UPDATING_SETTINGS')}: {errorMessage}
                </Message> :
                null
        );
    }

    onTestSMTPClick(event) {
        event.preventDefault();

        this.setState({
            loading: true
        });

        API.call({
            path: '/system/test-smtp',
            data: this.state.form
        }).then(() => PopupMessage.open({
            title: i18n('SETTINGS_UPDATED'),
            children: i18n('SMTP_SUCCESS'),
            type: 'success'
        }))
        .catch(result => PopupMessage.open({
            title: i18n('ERROR_UPDATING_SETTINGS'),
            children: result.message,
            type: 'error'
        }))
        .then(() => this.setState({
            loading: false
        }));
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
                    'url': root,
                    'language': this.props.language,
                    'mandatory-login': this.props['mandatory-login'] ? 1 : 0,
                    'registration': this.props['registration'] ? 1 : 0
                })
            })
                .then(() => history.push('/install/step-6'))
                .catch(({message}) => this.setState({
                    loading: false,
                    error: true,
                    showErrorMessage: true,
                    errorMessage: message
                }));
        });
    }

    onCloseMessage(showMessage) {
        this.setState({
            [showMessage]: false
        });
    }
}

export default connect((store) => {
    return {
        'mandatory-login': store.config['mandatory-login'],
        'registration': store.config['registration'],
        language: store.config.language
    };
})(InstallStep5Settings);
