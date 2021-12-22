import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import i18n from 'lib-app/i18n';

import MainHomePageLoginWidget from 'app/main/main-home/main-home-page-login-widget';
import MainHomePagePortal      from 'app/main/main-home/main-home-page-portal';
import Message                 from 'core-components/message';

class MainHomePage extends React.Component {

    state = {
        showMessage: true
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.session && this.props.session) {
            this.setState({showMessage : true});
        }
    }

    render() {
        const { config, loginForm } = this.props;
        return (
            <div className="main-home-page row">
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
                <MainHomePageLoginWidget />
            </div>
        );
    }

    renderSuccess() {
        return (
            <Message
                showMessage={this.state.showMessage}
                onCloseMessage={this.onCloseMessage.bind(this)}
                title={i18n('VERIFY_SUCCESS')}
                type="success"
                className="main-home-page__message">
                    {i18n('VERIFY_SUCCESS_DESCRIPTION')}
            </Message>
        );
    }

    renderFailed() {
        return (
            <Message
                showMessage={this.state.showMessage}
                onCloseMessage={this.onCloseMessage.bind(this)}
                title={i18n('VERIFY_FAILED')}
                type="error"
                className="main-home-page__message">
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
            'main-home-page__portal-wrapper': true,
            'col-md-8': (this.props.config['mandatory-login'] && this.props.config['layout'] === 'boxed'),
            'col-md-10 col-md-offset-1' : (!this.props.config['mandatory-login'])
        };

        return classNames(classes);
    }

    onCloseMessage() {
        this.setState({
            showMessage: false
        });
    }
}

export default connect((store) => {
    return {
        session: store.session,
        config: store.config,
        loginForm: store.loginForm
    };
})(MainHomePage);