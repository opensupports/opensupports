import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import i18n from 'lib-app/i18n';

import MainHomePageLoginWidget from 'app/main/main-home/main-home-page-login-widget';
import MainHomePagePortal      from 'app/main/main-home/main-home-page-portal';
import Message                 from 'core-components/message';

class MainHomePage extends React.Component {
    
    render() {
        const {
            config,
            loginForm
        } = this.props;
        return (
            <div className="main-home-page">
                {this.renderMessage()}
                {(config['mandatory-login']) || loginForm.loginFormShown ? this.renderLoginWidget() : null}
                {!loginForm.loginFormShown ?
                    <div className={this.getPortalClass()}>
                        <MainHomePagePortal type={((config['mandatory-login']) ? 'default' : 'complete')}/>
                    </div>:
                    null
                }
            </div>
        );
    }

    renderMessage() {
        switch (this.props.session.verify) {
            case 'success':
                return this.renderSuccess();
            case 'failed':
                return this.renderFailed();
            default:
                return null;
        }
    }

    renderLoginWidget() {
        return (
            <div className={this.getLoginWidgetClass()}>
                <MainHomePageLoginWidget className='login-widget__test'/>
            </div>
        );
    }

    renderSuccess() {
        return (
            <Message title={i18n('VERIFY_SUCCESS')} type="success" className="main-home-page__message">
                {i18n('VERIFY_SUCCESS_DESCRIPTION')}
            </Message>
        );
    }

    renderFailed() {
        return (
            <Message title={i18n('VERIFY_FAILED')} type="error" className="main-home-page__message">
                {i18n('VERIFY_FAILED_DESCRIPTION')}
            </Message>
        );
    }

    getLoginWidgetClass() {
        const { config } = this.props;
        let classes = {
            'col-md-4': config['mandatory-login'],
            'main-home-page__login-widget': config['mandatory-login'],
            'main-home-page__center': !config['mandatory-login']
        };

        return classNames(classes);
    }

    getPortalClass() {
        const { config } = this.props;
        let classes = {
            'main-home-page__portal-wrapper': config['mandatory-login'],
            'col-md-8': config['layout'] === 'boxed',
        };

        return classNames(classes);
    }
}

export default connect((store) => {
    return {
        session: store.session,
        config: store.config,
        loginForm: store.loginForm
    };
})(MainHomePage);