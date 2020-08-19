import React from 'react';
import {connect} from 'react-redux';

import history from 'lib-app/history';
import i18n from 'lib-app/i18n';
import ConfigActions from 'actions/config-actions';

import LanguageSelector from 'app-components/language-selector';
import Button from 'core-components/button';
import Header from 'core-components/header';

class InstallStep1Language extends React.Component {

    render() {
        return (
            <div className="install-step-1">
                <Header title={i18n('STEP_TITLE', {title: i18n('SELECT_LANGUAGE'), current: 1, total: 6})} description={i18n('STEP_1_DESCRIPTION')} />
                <LanguageSelector {...this.getLanguageSelectorProps()} />
                <div className="install-step-1__button">
                    <Button size="medium" type="secondary" onClick={() => history.push('/install/step-2')}>
                        {i18n('NEXT')}
                    </Button>
                </div>
            </div>
        );
    }

    getLanguageSelectorProps() {
        return {
            className: 'install-step-1__languages',
            value: this.props.config.language,
            type: 'allowed',
            onChange: this.changeLanguage.bind(this)
        };
    }

    changeLanguage(event) {
        this.props.dispatch(ConfigActions.changeLanguage(event.target.value));
    }
}


export default connect((store) => {
    return {
        config: store.config
    };
})(InstallStep1Language);