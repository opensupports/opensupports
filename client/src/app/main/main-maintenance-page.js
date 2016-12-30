import React from 'react';

import i18n from 'lib-app/i18n';
import Icon from 'core-components/icon';

class MainMaintenancePage extends React.Component {
    render() {
        return (
            <div className="main-maintenance-page">
                <div className="main-maintenance-page__icon">
                    <Icon name="wrench" size="4x"/>
                </div>
                <div className="main-maintenance-page__title">
                    {i18n('MAINTENANCE_MODE')}
                </div>
                <div className="main-maintenance-page__description">
                    {i18n('MAINTENANCE_MODE_DESCRIPTION')}
                </div>
            </div>
        );
    }
}

export default MainMaintenancePage;