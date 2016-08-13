import React              from 'react';
import { connect }        from 'react-redux'

import i18n               from 'lib-app/i18n';
import SessionActions     from 'actions/session-actions';
import ConfigActions      from 'actions/config-actions';

import Button             from 'core-components/button';
import DropDown           from 'core-components/drop-down';

let codeLanguages = {
    'English': 'us',
    'Spanish': 'es',
    'German': 'de',
    'French': 'fr',
    'Chinese': 'cn',
    'Turkish': 'tr',
    'Indian': 'in'
};

class MainLayoutHeader extends React.Component {

    render() {
        return (
            <div className="main-layout-header">
                {this.renderAccessLinks()}
                <DropDown className="main-layout-header--languages" items={this.getLanguageList()} onChange={this.changeLanguage.bind(this)}/>
            </div>
        );
    }
    
    renderAccessLinks() {
        let result;
        
        if (this.props.session.logged) {
            result = (
                <div className="main-layout-header--login-links">
                    Welcome, John 
                    <Button type="clean" onClick={this.logout.bind(this)}>(Close Session)</Button>
                </div>
            );
        } else {
            result = (
                <div className="main-layout-header--login-links">
                    <Button type="clean" route={{to:'/app'}}>{i18n('LOG_IN')}</Button>
                    <Button type="clean" route={{to:'/app/signup'}}>Sign up</Button>
                </div>
            );
        }

        return result;
    }

    getLanguageList() {
        return Object.keys(codeLanguages).map((language) => {
            return {
                content: language,
                icon: codeLanguages[language]
            };
        });
    }

    changeLanguage(event) {
        let language = Object.keys(codeLanguages)[event.index];

        this.props.dispatch(ConfigActions.changeLanguage(codeLanguages[language]));
    }

    logout() {
        this.props.dispatch(SessionActions.logout());
    }
}

export default connect((store) => {
    return {
        session: store.session,
        config: store.config
    };
})(MainLayoutHeader);
