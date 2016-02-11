import React              from 'react';

import i18n               from 'lib-app/i18n';
import CommonActions      from 'actions/common-actions';

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
                <div className="main-layout-header--login-links">
                    <Button type="clean" route={{to:'/app'}}>{i18n('LOG_IN')}</Button>
                    <Button type="clean" route={{to:'/app/signup'}}>Sign up</Button>
                </div>
                <DropDown className="main-layout-header--languages" items={this.getLanguageList()} onChange={this.changeLanguage}/>
            </div>
        );
    },

    getLanguageList() {
        return languageList.map((item) => {
            return {
                content: (
                    <span>
                        <Icon name={codeLanguages[item]} />{item}
                    </span>
                )
            };
        });
    },

    changeLanguage(event) {
        let language = languageList[event.index];

        CommonActions.changeLanguage(codeLanguages[language]);
    }
});

export default MainLayoutHeader;
