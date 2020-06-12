import React from 'react';

import history from 'lib-app/history';
import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Message from 'core-components/message';

class InstallStep6Admin extends React.Component {

    state = {
        loading: false,
        error: false,
        errorMessage: ''
    };

    render() {
        return (
            <div className="install-step-6">
                <Header title={i18n('STEP_TITLE', {title: i18n('ADMIN_SETUP'), current: 6, total: 7})} description={i18n('STEP_6_DESCRIPTION')} />
                {this.renderMessage()}
                <Form onSubmit={this.onSubmit.bind(this)}>
                    <FormField name="name" validation="NAME" label={i18n('ADMIN_NAME')} fieldProps={{size: 'large'}} required />
                    <FormField name="email" validation="EMAIL" label={i18n('ADMIN_EMAIL')} fieldProps={{size: 'large'}} required />
                    <FormField name="password" validation="PASSWORD" label={i18n('ADMIN_PASSWORD')} infoMessage={i18n('ADMIN_PASSWORD_DESCRIPTION')} fieldProps={{size: 'large', autoComplete: 'off'}} required />
                    <div className="install-step-6__buttons">
                        <SubmitButton className="install-step-6__next" size="extra-small" type="secondary">{i18n('NEXT')}</SubmitButton>
                    </div>
                </Form>
            </div>
        );
    }

    renderMessage() {
        let message = null;

        if(this.state.error) {
            message = (
                <Message className="install-step-6_message" type="error">
                    {i18n('ERROR_UPDATING_SETTINGS')}: {this.state.errorMessage}
                </Message>
            );
        }

        return message;
    }

    onSubmit(form) {
        this.setState({
            loading: true
        }, () => {
            API.call({
                path: '/system/init-admin',
                data: form
            })
                .then(() => history.push('/install/step-7'))
                .catch(({message}) => this.setState({
                    loading: false,
                    error: true,
                    errorMessage: message
                }));
        });
    }
}

export default InstallStep6Admin;