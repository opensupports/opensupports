import React              from 'react';

import i18n               from 'lib-app/i18n';
import CommonActions      from 'actions/common-actions';
import UserActions        from 'actions/user-actions';
import UserStore          from 'stores/user-store';

import Button             from 'core-components/button';
import DropDown           from 'core-components/drop-down';
import Icon               from 'core-components/icon';

let languageList = ['English', 'Spanish', 'Portuguese', 'German', 'Turkish', 'Indian'];
let codeLanguages = {
    'English': 'us',
    'Spanish': 'es',
    'Portuguese': 'pt',
    'German': 'de',
    'Turkish': 'tr',
    'Indian': 'in'
};

let MainLayoutHeader = React.createClass({

    render() {
        return (
            <div className="main-layout-header">
                {this.renderAccessLinks()}
                <DropDown className="main-layout-header--languages" items={this.getLanguageList()} onChange={this.changeLanguage}/>
            </div>
        );
    },
    
    renderAccessLinks() {
        let result;
        if (UserStore.isLoggedIn()) {
            result = (
                <div className="main-layout-header--login-links">
                    Welcome, pepito 
                    <Button type="clean" onClick={this.logout}>(Close Session)</Button>
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
    },

    getLanguageList() {
        return languageList.map((language) => {
            return {
                content: language,
                icon: codeLanguages[language]
            };
        });
    },

    changeLanguage(event) {
        let language = languageList[event.index];

        CommonActions.changeLanguage(codeLanguages[language]);
    },

    logout() {
        UserActions.logout();
    }
});

export default MainLayoutHeader;
