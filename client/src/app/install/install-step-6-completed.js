import React from 'react';
import {browserHistory} from 'react-router';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import Header from 'core-components/header';
import Message from 'core-components/message';

class InstallStep6Completed extends React.Component {

    componentDidMount() {
        setTimeout(() => browserHistory.push('/admin'), 5000);
    }

    render() {
        return (
            <div className="install-step-6">
                <Header title={i18n('STEP_TITLE', {title: i18n('COMPLETED'), current: 6, total: 6})} description={i18n('STEP_6_DESCRIPTION')}/>
                <Message title={i18n('INSTALLATION_COMPLETED')} type="success">
                    {i18n('INSTALLATION_COMPLETED_DESCRIPTION')}
                </Message>
            </div>
        );
    }
}

export default InstallStep6Completed;