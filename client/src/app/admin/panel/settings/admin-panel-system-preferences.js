import React from 'react';
import _ from 'lodash';
import store from 'app/store';

import ConfigActions from 'actions/config-actions';
import API from 'lib-app/api-call';
import i18n from 'lib-app/i18n';
import LanguageSelector from 'app-components/language-selector';
import ToggleButton from 'app-components/toggle-button';
import languageList from 'data/language-list';

import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import Header from 'core-components/header';
import SubmitButton from 'core-components/submit-button';
import Button from 'core-components/button';
import Message from 'core-components/message';
import InfoTooltip from 'core-components/info-tooltip';

const languageKeys = Object.keys(languageList);

class AdminPanelSystemPreferences extends React.Component {

    state = {
        loading: true,
        message: null,
        values: {
            maintenance: false
        }
    };

    componentDidMount() {
        this.recoverSettings();
    }

    render() {
        return (
            <div className="admin-panel-system-preferences">
                <Header title={i18n('SYSTEM_PREFERENCES')} description={i18n('SYSTEM_PREFERENCES_DESCRIPTION')}/>
                <Form values={this.state.values} onChange={this.onFormChange.bind(this)} onSubmit={this.onSubmit.bind(this)} loading={this.state.loading}>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="admin-panel-system-preferences__maintenance">
                                <span>{i18n('MAINTENANCE_MODE')} <InfoTooltip text={i18n('MAINTENANCE_MODE_INFO')} /></span>
                                <FormField className="admin-panel-system-preferences__maintenance-field" name="maintenance-mode" decorator={ToggleButton}/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <span className="separator" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <FormField label={i18n('SUPPORT_CENTER_URL')} fieldProps={{size: 'large'}} name="url" validation="URL" required/>
                            <FormField label={i18n('SUPPORT_CENTER_LAYOUT')} fieldProps={{size: 'large', items: [{content: i18n('BOXED')}, {content: i18n('FULL_WIDTH')}]}} field="select" name="layout" />
                        </div>
                        <div className="col-md-6">
                            <FormField label={i18n('SUPPORT_CENTER_TITLE')} fieldProps={{size: 'large'}} name="title" validation="TITLE" required/>
                            <FormField label={i18n('DEFAULT_TIMEZONE')} fieldProps={{size: 'large'}} name="time-zone"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <span className="separator" />
                            <div className="row">
                                <div className="col-md-6">
                                    <FormField label={i18n('NOREPLY_EMAIL')} fieldProps={{size: 'large'}} name="no-reply-email"/>
                                    <FormField label={i18n('SMTP_USER')} fieldProps={{size: 'large'}} name="smtp-user"/>
                                </div>
                                <div className="col-md-6">
                                    <div className="row">
                                        <div className="col-md-9">
                                            <FormField label={i18n('SMTP_SERVER')} fieldProps={{size: 'large'}} name="smtp-host"/>
                                            <FormField label={i18n('SMTP_PASSWORD')} fieldProps={{size: 'large', password: true}} name="smtp-pass"/>
                                        </div>
                                        <div className="col-md-3">
                                            <FormField label={i18n('PORT')} fieldProps={{size: 'auto'}} name="smtp-port"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <span className="separator" />
                        </div>
                        <div className="col-md-6">
                            <div className="row admin-panel-system-preferences__languages">
                                <div className="col-md-6 admin-panel-system-preferences__languages-allowed">
                                    <div>{i18n('ALLOWED_LANGUAGES')} <InfoTooltip text={i18n('ALLOWED_LANGUAGES_INFO')} /></div>
                                    <FormField name="allowedLanguages" field="checkbox-group" fieldProps={{items: this.getLanguageList()}} validation="LIST" required/>
                                </div>
                                <div className="col-md-6 admin-panel-system-preferences__languages-supported">
                                    <div>{i18n('SUPPORTED_LANGUAGES')} <InfoTooltip text={i18n('SUPPORTED_LANGUAGES_INFO')} /></div>
                                    <FormField name="supportedLanguages" field="checkbox-group" fieldProps={{items: this.getLanguageList()}} validation="LIST" required/>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <FormField className="admin-panel-system-preferences__default-language-field" name="language" label={i18n('DEFAULT_LANGUAGE')} decorator={LanguageSelector} fieldProps={{
                                type: 'custom',
                                customList: (this.state.values.supportedLanguages && this.state.values.supportedLanguages.length) ? this.state.values.supportedLanguages.map(index => languageKeys[index]) : undefined
                            }} />
                            <FormField label={i18n('RECAPTCHA_PUBLIC_KEY')} fieldProps={{size: 'large'}} name="reCaptchaKey"/>
                            <FormField label={i18n('RECAPTCHA_PRIVATE_KEY')} fieldProps={{size: 'large'}} name="reCaptchaPrivate"/>
                            <div className="admin-panel-system-preferences__file-attachments">
                                <span>{i18n('ALLOW_FILE_ATTACHMENTS')}</span>
                                <FormField className="admin-panel-system-preferences__file-attachments-field" name="allow-attachments" decorator={ToggleButton}/>
                            </div>
                            <div className="admin-panel-system-preferences__max-size">
                                <span>{i18n('MAX_SIZE_KB')}</span>
                                <FormField className="admin-panel-system-preferences__max-size-field" fieldProps={{size: 'small'}} name="max-size"/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <span className="separator" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 col-md-offset-2">
                            <SubmitButton type="secondary">{i18n('UPDATE_SETTINGS')}</SubmitButton>
                        </div>
                        <div className="col-md-4">
                            <Button onClick={this.onDiscardChangesSubmit.bind(this)}>{i18n('DISCARD_CHANGES')}</Button>
                        </div>
                    </div>
                </Form>
                {this.renderMessage()}
            </div>
        );
    }

    renderMessage() {
        switch (this.state.message) {
            case 'success':
                return <Message className="admin-panel-system-preferences__message" type="success">{i18n('SETTINGS_UPDATED')}</Message>;
            case 'fail':
                return <Message className="admin-panel-system-preferences__message" type="error">{i18n('ERROR_UPDATING_SETTINGS')}</Message>;
            default:
                return null;
        }
    }

    onFormChange(form) {
        let values = _.clone(form);

        _.extend(values, {
            supportedLanguages: _.filter(values.supportedLanguages, (language) => _.includes(values.allowedLanguages, language))
        });

        this.setState({values, message: null});
    }

    onSubmit(form) {
        this.setState({loading: true});

        API.call({
            path: '/system/edit-settings',
            data: {
                'language': form.language,
                'recaptcha-public': form.reCaptchaKey,
                'recaptcha-private': form.reCaptchaPrivate,
                'url': form['url'],
                'title': form['title'],
                'layout': form['layout'] == 1 ? 'Full width' : 'Boxed',
                'time-zone': form['time-zone'],
                'no-reply-email': form['no-reply-email'],
                'smtp-host': form['smtp-host'],
                'smtp-port': form['smtp-port'],
                'smtp-user': form['smtp-user'],
                'smtp-pass': form['smtp-pass'],
                'maintenance-mode': form['maintenance-mode'],
                'allow-attachments': form['allow-attachments'],
                'max-size': form['max-size'],
                'allowedLanguages': JSON.stringify(form.allowedLanguages.map(index => languageKeys[index])),
                'supportedLanguages': JSON.stringify(form.supportedLanguages.map(index => languageKeys[index]))
            }
        }).then(this.onSubmitSuccess.bind(this)).catch(() => this.setState({loading: false, message: 'fail'}));
    }

    onSubmitSuccess() {
        this.recoverSettings();
        this.setState({
            message: 'success',
            loading: false
        });
    }

    getLanguageList() {
        return Object.keys(languageList).map(key => languageList[key].name);
    }

    recoverSettings() {
        API.call({
            path: '/system/get-settings',
            data: {
                allSettings: true
            }
        }).then(this.onRecoverSettingsSuccess.bind(this)).catch(this.onRecoverSettingsFail.bind(this));
    }

    onRecoverSettingsSuccess(result) {
        this.setState({
            loading: false,
            values: {
                'language': result.data.language,
                'reCaptchaKey': result.data.reCaptchaKey,
                'reCaptchaPrivate': result.data.reCaptchaPrivate,
                'url': result.data['url'],
                'title': result.data['title'],
                'layout': result.data['layout'] == 'Full width' ? 1 : 0,
                'time-zone': result.data['time-zone'],
                'no-reply-email': result.data['no-reply-email'],
                'smtp-host': result.data['smtp-host'],
                'smtp-port': result.data['smtp-port'],
                'smtp-user': result.data['smtp-user'],
                'smtp-pass': '',
                'maintenance-mode': result.data['maintenance-mode'],
                'allow-attachments': result.data['allow-attachments'],
                'max-size': result.data['max-size'],
                'allowedLanguages': result.data.allowedLanguages.map(lang => (_.indexOf(languageKeys, lang))),
                'supportedLanguages': result.data.supportedLanguages.map(lang => (_.indexOf(languageKeys, lang)))
            }
        });

        store.dispatch(ConfigActions.updateData());
    }

    onRecoverSettingsFail() {
        this.setState({
            message: 'error'
        });
    }
    
    onDiscardChangesSubmit(event) {
        event.preventDefault();
        this.setState({loading: true});
        this.recoverSettings();
    }
}

export default AdminPanelSystemPreferences;