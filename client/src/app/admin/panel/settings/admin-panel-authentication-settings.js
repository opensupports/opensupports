import React from 'react';

import i18n from 'lib-app/i18n';

import Header from 'core-components/header';

import SocialLoginSettings from 'app-components/social-login-settings'
class AdminPanelAuthenticationSettings extends React.Component {


    render() {
        return (
            <div className="admin-panel-authentication-settings">
                <Header title={i18n('AUTHENTICATION_SETTINGS')} description={i18n('AUTHENTICATION_SETTINGS_DESCRIPTION')}/>
                <SocialLoginSettings />
            </div>
        )
    }
}

export default AdminPanelAuthenticationSettings;