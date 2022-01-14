import React from 'react';

import store from 'app/store';
import ConfigActions from 'actions/config-actions';
import i18n from 'lib-app/i18n';

import Message from 'core-components/message';

class InstallCompleted extends React.Component {

    componentDidMount() {
        store.dispatch(ConfigActions.init());

        setTimeout(() => {
            store.dispatch(ConfigActions.checkInstallation());
        }, 3000);
    }

    render() {
        return (
            <div className="install-completed">
                <Message showCloseButton={false} title={i18n('INSTALLATION_COMPLETED_TITLE')} type="success">
                    {i18n('INSTALLATION_COMPLETED_DESCRIPTION')}
                </Message>
            </div>
        );
    }
}

export default InstallCompleted;
