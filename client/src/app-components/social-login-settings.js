import React from 'react';
import store from 'app/store';

import i18n from 'lib-app/i18n';

import ConfigActions from 'actions/config-actions';
import API from 'lib-app/api-call';

import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Button from 'core-components/button';

class SocialLoginSettings extends React.Component {

    state = {
        loading: true,
        message: null,
        values: {
            "enable-google-login": false,
            "enable-facebook-login": false,
            "enable-linkedin-login": false,
            "google-key": "",
            "facebook-key": "",
            "linkedin-key": ""
        }
    };

    componentDidMount() {
        this.recoverSettings();
    }

    render() {
        return (
            <div className="social-login-settings">
                <Header title={i18n('SOCIAL_LOGIN')} description={i18n('SOCIAL_LOGIN_DESCRIPTION')} />
                <Form
                    className="social-login-settings__form"
                    values={this.state.values}
                    onChange={this.onFormChange.bind(this)}
                    onSubmit={this.onSubmit.bind(this)}
                    loading={this.state.loading}>
                        {this.renderSettings()}
                        <div className="social-login-settings__form__container">
                            <SubmitButton className="social-login-settings__container__submit-button" size="medium" type="secondary">
                                {i18n('UPDATE_SETTINGS')}
                            </SubmitButton>
                            <Button className="social-login-settings__container__discard-button" size="medium" onClick={this.onDiscardChangesSubmit.bind(this)}>
                                {i18n('DISCARD_CHANGES')}
                            </Button>
                        </div>
                </Form>
            </div>
        )
    }

    renderSettings() {
        const socialLoginPlataforms = [
            {name: "Google"},
            {name: "Facebook"},
            {name: "LinkedIn"}
        ];

        return (
            socialLoginPlataforms.map((plataform, index) => {
                const plataformNameLowerCase = plataform.name.toLowerCase();
                const socialLoginContainerClassName = `social-login-settings__form__${plataformNameLowerCase}-container`;

                return (
                    <div className={socialLoginContainerClassName} key={index}>
                        <FormField
                            name={`enable-${plataformNameLowerCase}-login`}
                            className={`${socialLoginContainerClassName}__${plataformNameLowerCase}-checkbox`}
                            label={`Enable ${plataform.name} Login`}
                            field="checkbox" />
                        <FormField
                            name={`${plataformNameLowerCase}-key`}
                            className={`${socialLoginContainerClassName}__${plataformNameLowerCase}-key`}
                            label={`${plataform.name} Key`}
                            fieldProps={{size: 'large', disabled: !this.state.values[`enable-${plataformNameLowerCase}-login`]}} />
                    </div>
                );
            })
        )
    }

    onFormChange(form) {
        this.setState({
            values: {
                ...form,
                "google-key": form["enable-google-login"] ? form["google-key"] : "",
                "facebook-key": form["enable-facebook-login"] ? form["facebook-key"] : "",
                "linkedin-key": form["enable-linkedin-login"] ? form["linkedin-key"] : ""
            }
        })
    }

    onSubmit(form) {
        this.setState({loading: true});

        API.call({
            path: '/system/edit-settings',
            data: {
                'enable-google-login': form['enable-google-login']*1,
                'enable-facebook-login': form['enable-facebook-login']*1,
                'enable-linkedin-login': form['enable-linkedin-login']*1
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

    recoverSettings() {
        API.call({
            path: '/system/get-settings',
            data: {}
        }).then(this.onRecoverSettingsSuccess.bind(this)).catch(this.onRecoverSettingsFail.bind(this));
    }

    onRecoverSettingsSuccess(result) {
        const data = result.data;

        this.setState({
            loading: false,
            values: {
                'enable-google-login': !!(data['enable-google-login']*1),
                'enable-facebook-login': !!(data['enable-facebook-login']*1),
                'enable-linkedin-login': !!(data['enable-linkedin-login']*1)
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

export default SocialLoginSettings;
