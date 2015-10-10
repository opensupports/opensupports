import React              from 'react/addons';
import Button             from 'core-components/button';
import CommonActions      from 'actions/common-actions';
import i18n               from 'utils/i18n';

var MainLayoutHeader = React.createClass({

    render() {
        return (
            <div className="main-layout-header">
                <div className="main-layout-header--login-links">
                   <Button type="clean" route={{to:'/app'}}>{i18n('LOG_IN')}</Button>
                   <Button type="clean" route={{to:'/app/signup'}}>{i18n('SIGN_UP')}</Button>
                   <Button type="clean" onClick={function () {CommonActions.changeLanguage('es');}}>Spanish</Button>
                   <Button type="clean" onClick={function () {CommonActions.changeLanguage('en');}}>English</Button>
                </div>
            </div>
        );
    }
});

export default MainLayoutHeader;