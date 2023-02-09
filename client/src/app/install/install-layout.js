import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import DocumentTitle from 'react-document-title';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import Widget from 'core-components/widget';
import Icon from 'core-components/icon';

const steps = [
    'LANGUAGE',
    'SERVER_REQUIREMENTS',
    'DATABASE_CONFIGURATION',
    'SETTINGS',
    'ADMIN_SETUP',
    'COMPLETED'
];

class InstallLayout extends React.Component {

    render() {
        return (
            <DocumentTitle title="OpenSupports Installation">
                <Widget className="install-layout">
                    <div className="install-layout__header row">
                        <div className="install-layout__header-logo col-md-4">
                            <img width="100%" src={API.getURL() + '/images/logo.png'} alt="OpenSupports Installation"/>
                        </div>
                        <div className="install-layout__header-text  col-md-8">
                            <div className="install-layout__header-title">
                                {i18n('INSTALL_HEADER_TITLE')}
                            </div>
                            <div className="install-layout__header-description">
                                {i18n('INSTALL_HEADER_DESCRIPTION')}
                            </div>
                        </div>
                    </div>
                    <span className="separator"/>
                    <div className="install-layout__body row">
                        <div className="col-md-3">
                            <ul className="install-layout__steps">
                                {steps.map(this.renderStep.bind(this))}
                            </ul>
                        </div>
                        <div className="install-layout__content col-md-9">
                            {this.props.children}
                        </div>
                    </div>
                </Widget>
            </DocumentTitle>
        );
    }

    renderStep(key, index) {
        let classes = {
            'install-layout__step': true,
            'install-layout__step_current': index === this.getCurrentStep(),
            'install-layout__step_previous': index < this.getCurrentStep()
        };
        let icon = 'circle-thin';

        if(index === this.getCurrentStep()) {
            icon = 'arrow-circle-right';
        } else if(index < this.getCurrentStep()) {
            icon = 'check-circle';
        }

        return (
            <li className={classNames(classes)} key={index}>
                <Icon name={icon} size="sm" className="install-layout__step-icon"/>
                <span className="install-layout__step-text">
                    {index+1}. {i18n(key)}
                </span>
            </li>
        )
    }

    getCurrentStep() {
        const pathname = this.props.location.pathname;

        if(_.includes(pathname, 'step-1')) {
            return 0;
        } else if(_.includes(pathname, 'step-2')) {
            return 1;
        } else if(_.includes(pathname, 'step-3')) {
            return 2;
        } else if(_.includes(pathname, 'step-4')) {
            return 3;
        } else if(_.includes(pathname, 'step-5')) {
            return 4;
        } else if(_.includes(pathname, 'step-6')) {
            return 5;
        } else if(_.includes(pathname, 'step-7')) {
            return 6;
        }
    }
}

export default InstallLayout;