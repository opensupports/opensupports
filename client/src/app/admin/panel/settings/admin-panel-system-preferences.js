import React from 'react';

import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import Header from 'core-components/header';
import SubmitButton from 'core-components/submit-button';
import Button from 'core-components/button';

import ToggleButton from 'app-components/toggle-button';
import i18n from 'lib-app/i18n';

class AdminPanelSystemPreferences extends React.Component {

    state = {
        values: {
            'maintenance': false
        }
    };

    render() {
        return (
            <div className="admin-panel-system-preferences">
                <Header title={i18n('SYSTEM_PREFERENCES')} description="Here you can adjust your system preferences :)"/>
                <Form values={this.state.values} onChange={values => this.setState({values})} onSubmit={this.onSubmit.bind(this)}>
                    <div className="admin-panel-system-preferences__maintenance">
                        <span>Maintenance Mode</span>
                        <FormField className="admin-panel-system-preferences__maintenance-field" name="maintenance-mode" decorator={ToggleButton}/>
                    </div>
                    <span className="separator" />
                    <div className="row">
                        <div className="col-md-6">
                            <FormField label={i18n('SUPPORT_CENTER_URL')} fieldProps={{size: 'large'}} name="url"/>
                            <FormField label={i18n('SUPPORT_CENTER_LAYOUT')} fieldProps={{size: 'large', items: [{content: i18n('BOXED')}, {content: i18n('FULL_WIDTH')}]}} field="select" name="layout"/>
                        </div>
                        <div className="col-md-6">
                            <FormField label={i18n('SUPPORT_CENTER_TITLE')} fieldProps={{size: 'large'}} name="system-title"/>
                            <FormField label={i18n('DEFAULT_TIMEZONE')} fieldProps={{size: 'large'}} name="time-zone"/>
                        </div>
                    </div>
                    <span className="separator" />
                    <div className="row">
                        <div className="col-md-4">
asd
                        </div>
                        <div className="col-md-8">
                            <div className="row">
                                <div className="col-md-6">
                                    <FormField label={i18n('NOREPLY_EMAIL')} fieldProps={{size: 'auto'}} name="email"/>
                                    <FormField label={i18n('SMTP_USER')} fieldProps={{size: 'auto'}} name="smtp_user"/>
                                </div>
                                <div className="col-md-6">
                                    <div className="row">
                                        <div className="col-md-9">
                                            <FormField label={i18n('SMTP_SERVER')} fieldProps={{size: 'auto'}} name="smtp_server"/>
                                        </div>
                                        <div className="col-md-3">
                                            <FormField label={i18n('PORT')} fieldProps={{size: 'auto'}} name="port"/>
                                        </div>
                                    </div>
                                    <FormField label={i18n('SMTP_PASSWORD')} fieldProps={{size: 'auto'}} name="smtp_password"/>
                                </div>
                            </div>
                            <span className="separator" />
                            <div className="row">
                                <div className="col-md-6">
                                    <FormField label={i18n('RECAPTCHA_PUBLIC_KEY')} fieldProps={{size: 'auto'}} name="public_key"/>
                                </div>
                                <div className="col-md-6">
                                    <FormField label={i18n('RECAPTCHA_PRIVATE_KEY')} fieldProps={{size: 'auto'}} name="private_key"/>
                                </div>
                            </div>
                            <span className="separator" />
                            <div className="row">
                                <div className="col-md-5 col-md-offset-1">
                                    <div className="admin-panel-system-preferences__file-attachments">
                                        <span>{i18n('ALLOW_FILE_ATTACHMENTS')}</span>
                                        <FormField className="admin-panel-system-preferences__file-attachments-field" name="file-attachments" decorator={ToggleButton}/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="admin-panel-system-preferences__max-size">
                                        <span>{i18n('MAX_SIZE_KB')}</span>
                                        <FormField className="admin-panel-system-preferences__max-size-field" fieldProps={{size: 'small'}} name="max-size"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 col-md-offset-2">
                            <SubmitButton type="secondary">{i18n('UPDATE_SYSTEM')}</SubmitButton>
                        </div>
                        <div className="col-md-4">
                            <Button onClick={event => event.preventDefault()}>{i18n('DISCARD_CHANGES')}</Button>
                        </div>
                    </div>
                </Form>
            </div>
        );
    }

    onSubmit() {
        alert('WESA');
    }
}

export default AdminPanelSystemPreferences;