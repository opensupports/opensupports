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
                {this.renderHeaderOptions()}
            </div>
        );
    }

    renderHeaderOptions(){
        let result = null;
        
        if(!this.props.config['maintenance-mode']){
            result = (<div>
                {this.renderAccessLinks()}
                <LanguageSelector {...this.getLanguageSelectorProps()} />
            </div>)
        }

        return result;
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
                    className="main-layout-header__login-links__button"
                    type="clean"
                    onClick={this.onHideLoginForm.bind(this)}
                    route={{to:'/'}}>
                        {i18n('HOME')}
                    </Button>
                    {(config['registration'] * 1) ?
                        <Button className="main-layout-header__login-links__button" type="clean" route={{to:'/signup'}}>
                            {i18n('SIGN_UP')}
                        </Button> :
                        null}
                    {!config['mandatory-login'] ?
                        <Button className="main-layout-header__login-links__button" type="clean" onClick={this.onShowLoginForm.bind(this)} route={{to:'/'}}>
                            {i18n('LOG_IN')}
                        </Button> :
                        null}
                </div>
            );
        }

        return result;
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
