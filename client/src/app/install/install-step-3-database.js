import React from 'react';
import _ from 'lodash';

import history from 'lib-app/history';
import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import Button from 'core-components/button';
import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Message from 'core-components/message';

class InstallStep3Database extends React.Component {

    state = {
        loading: false,
        error: false,
        showErrorMessage: true,
        errorMessage: ''
    };

    render() {
        const { loading } = this.state;
        return (
            <div className="install-step-3">
                <Header title={i18n('STEP_TITLE', {title: i18n('DATABASE_CONFIGURATION'), current: 3, total: 6})} description={i18n('STEP_3_DESCRIPTION')} />
                {this.renderMessage()}
                <Form loading={loading} onSubmit={this.onSubmit.bind(this)}>
                    <FormField name="dbHost" label={i18n('DATABASE_HOST')} fieldProps={{size: 'large'}} required/>
                    <FormField name="dbPort" label={i18n('DATABASE_PORT')} fieldProps={{size: 'large'}} infoMessage={i18n('DEFAULT_PORT')}/>
                    <FormField name="dbName" label={i18n('DATABASE_NAME')} fieldProps={{size: 'large'}} infoMessage={i18n('LEFT_EMPTY_DATABASE')}/>
                    <FormField name="dbUser" label={i18n('DATABASE_USER')} fieldProps={{size: 'large'}} required/>
                    <FormField name="dbPassword" label={i18n('DATABASE_PASSWORD')} fieldProps={{size: 'large', password: true}}/>
                    <div className="install-step-3__buttons">
                        <Button className="install-step-3__previous" disabled={loading} size="medium" onClick={this.onPreviousClick.bind(this)}>{i18n('PREVIOUS')}</Button>
                        <SubmitButton className="install-step-3__next" size="medium" type="secondary">{i18n('NEXT')}</SubmitButton>
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
                    className="install-step-3__message"
                    type="error">
                        {i18n('ERROR_UPDATING_SETTINGS')}: {errorMessage}
                </Message> :
                null
        );
    }

    onPreviousClick(event) {
        event.preventDefault();
        history.push('/install/step-2');
    }

    onSubmit(form) {
        this.setState({
            loading: true
        }, () => {
            API.call({
                path: '/system/init-database',
                data: _.extend({}, form, {dbPort: form.dbPort || 3306})
            })
                .then(() => history.push('/install/step-4'))
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

export default InstallStep3Database;
