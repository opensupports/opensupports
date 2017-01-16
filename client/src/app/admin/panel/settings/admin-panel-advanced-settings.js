import React from 'react';
import {connect}  from 'react-redux';

import ConfigActions from 'actions/config-actions';
import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';
import ToggleButton from 'app-components/toggle-button';

import Header from 'core-components/header';

class AdminPanelAdvancedSettings extends React.Component {

    state = {
        loading: true,
        values: {

        }
    };

    render() {
        return (
            <div className="admin-panel-system-settings">
                <Header title={i18n('ADVANCED_SETTINGS')} description={i18n('ADVANCED_SETTINGS_DESCRIPTION')}/>
                <div className="row">
                    <div className="col-md-12">
                        <div className="col-md-6">
                            <div className="admin-panel-system-settings__user-system-enabled">
                                <ToggleButton className="admin-panel-system-settings__user-system-enabled-toggle-button" value={this.props.config['user-system-enabled']}/>
                                <span>{i18n('USER_SYSTEM_ENABLED')}</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="admin-panel-system-settings__registration">
                                <ToggleButton className="admin-panel-system-settings__user-system-enabled-toggle-button" value={this.props.config['registration']}/>
                                <span>{i18n('REGISTRATION')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <span className="separator" />
                    </div>
                </div>
            </div>
        );
    }

}


export default connect((store) => {
    return {
        config: store.config
    };
})(AdminPanelAdvancedSettings);
