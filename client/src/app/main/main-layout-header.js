import React              from 'react';
import {connect}          from 'react-redux';

import i18n               from 'lib-app/i18n';
import ConfigActions      from 'actions/config-actions';

import LanguageSelector   from 'app-components/language-selector';
import Button             from 'core-components/button';
import loginFormActions from '../../actions/login-form-actions';

class MainLayoutHeader extends React.Component {

    render() {
        return (
            <div className="main-layout-header">
                {true ? this.renderAccessLinks() : this.renderHomeLink()}
                <LanguageSelector {...this.getLanguageSelectorProps()} />
            </div>
        );
    }
    
    renderAccessLinks() {
        const {
            session,
            config
        } = this.props;
        let result;
        
        if (session.logged) {
            result = (
                <div className="main-layout-header__login-links">
                    {i18n('WELCOME')}, 
                    <span className="main-layout-header__user-name"> {session.userName}</span>
                </div>
            );
        } else {
            result = (
                <div className="main-layout-header__login-links">
                    <Button
                    type="clean"
                    onClick={this.onHideLoginForm.bind(this)}
                    route={{to:'/'}}>
                        {i18n('HOME')}
                    </Button>
                    {(config['registration'] * 1) ?
                        <Button type="clean" route={{to:'/signup'}}>
                            {i18n('SIGN_UP')}
                        </Button> :
                        null}
                    {!config['mandatory-login'] ?
                        <Button type="clean" onClick={this.onShowLoginForm.bind(this)} route={{to:'/'}}>
                            {i18n('LOG_IN')}
                        </Button> :
                        null}
                </div>
            );
        }

        return result;
    }

    renderHomeLink() {
        return (
            <div className="main-layout-header__login-links">
                <Button
                    type="clean"
                    onClick={this.onHideLoginForm.bind(this)}
                    route={{to:'/'}}>
                        {i18n('HOME')}
                </Button>
                {(!!(this.props.config['registration'] * 1)) ?
                    <div className="main-layout-header__login-links">
                        <Button type="clean" route={{to:'/signup'}}>{i18n('SIGN_UP')}</Button>
                        <Button
                            type="clean"
                            onClick={this.onShowLoginForm.bind(this)}
                            route={{to:'/'}}>
                                {i18n('LOG_IN')}
                        </Button>
                    </div>: 
                    null}
            </div>
        );
    }

    getLanguageSelectorProps() {
        return {
            className: 'main-layout-header__languages',
            value: this.props.config.language,
            type: 'allowed',
            onChange: this.changeLanguage.bind(this)
        };
    }

    changeLanguage(event) {
        this.props.dispatch(ConfigActions.changeLanguage(event.target.value));
    }

    onShowLoginForm() {
        this.props.dispatch(loginFormActions.showLoginForm())
    }

    onHideLoginForm() {
        this.props.dispatch(loginFormActions.hideLoginForm())
    }
}

export default connect((store) => {
    return {
        session: store.session,
        config: store.config,
    };
})(MainLayoutHeader);
