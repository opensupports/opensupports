import React from 'react';

import {connect}        from 'react-redux'
import i18n from 'lib-app/i18n';

import MainHomePageLoginWidget from 'app/main/main-home/main-home-page-login-widget';
import MainHomePagePortal      from 'app/main/main-home/main-home-page-portal';
import Message                 from 'core-components/message';

class MainHomePage extends React.Component {
    
    render() {
        return (
            <div className="main-home-page">
                {this.renderMessage()}
                <div className="col-md-4">
                    <MainHomePageLoginWidget />
                </div>
                <div className="col-md-8">
                    <MainHomePagePortal />
                </div>
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
}

export default connect((store) => {
    return {
        session: store.session
    };
})(MainHomePage);