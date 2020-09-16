import React from 'react';

import i18n from 'lib-app/i18n';

import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';

class SocialLoginSettings extends React.Component {

    render() {
        return (
            <div className="social-login-settings">
                <Header title={i18n('SOCIAL_LOGIN')} description={i18n('SOCIAL_LOGIN_DESCRIPTION')} />
                <Form className="social-login-settings__form">
                    {this.renderSettings()}
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

                return (
                    <FormField
                        key={index}
                        name={`${plataformNameLowerCase}-key`}
                        className={`social-login-settings__form__key social-login-settings__form__${plataformNameLowerCase}-key`}
                        label={`${plataform.name} Key`}
                        fieldProps={{size: 'large'}}
                        infoMessage="" />
                );
            })
        )
    }
}

export default SocialLoginSettings;
