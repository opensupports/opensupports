import React              from 'react/addons';

import i18n               from 'lib/i18n';
import CommonActions      from 'actions/common-actions';

import Button             from 'core-components/button';
import DropDown           from 'core-components/drop-down';
import Icon               from 'core-components/icon';

var languageList = ['English', 'Spanish', 'Portuguese', 'German', 'Turkish', 'Indian'];
var codeLanguages = {
    'English': 'us',
    'Spanish': 'es',
    'Portuguese': 'pt',
    'German': 'de',
    'Turkish': 'tr',
    'Indian': 'in'
};

var MainLayoutHeader = React.createClass({

    render() {
        return (
            <div className="main-layout-header">
                <div className="main-layout-header--login-links">
                    <Button type="clean" route={{to:'/app'}}>{i18n('LOG_IN')}</Button>
                    <Button type="clean" route={{to:'/app/signup'}}>{i18n('SIGN_UP')}</Button>
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
        var language = languageList[event.index];

        CommonActions.changeLanguage(codeLanguages[language]);
    }
});

export default MainLayoutHeader;