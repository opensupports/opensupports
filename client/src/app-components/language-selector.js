import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import languageList from 'data/language-list';
import DropDown from 'core-components/drop-down';

const languageCodes = Object.keys(languageList);

class LanguageSelector extends React.Component {
    static propTypes = {
        value: React.PropTypes.oneOf(languageCodes),
        type: React.PropTypes.oneOf(['allowed', 'supported', 'custom']),
        customList: React.PropTypes.array,
        allowedLanguages: React.PropTypes.array,
        supportedLanguages: React.PropTypes.array
    };

    static defaultProps = {
        type: 'allowed',
        customList: ['en'],
        allowedLanguages: languageCodes,
        supportedLanguages: languageCodes
    };

    render() {
        return (
            <DropDown {...this.getProps()}/>
        );
    }

    getProps() {
        return {
            className: this.getClass(),
            items: this.getLanguageItems(),
            selectedIndex: this.getSelectedIndex(),
            onChange: this.changeLanguage.bind(this),
            size: this.props.size
        };
    }

    getClass() {
        let classes = {
            'language-selector': true
        };

        classes[this.props.className] = (this.props.className);

        return classNames(classes);
    }

    getLanguageItems() {
        return this.getLanguageList().map((languageKey) => {
            return {
                content: languageList[languageKey].name,
                icon: (languageKey === 'en') ? 'us' : languageKey
            };
        });
    }

    getSelectedIndex() {
        let selectedIndex = this.getLanguageList().indexOf(this.props.value);

        return (selectedIndex !== -1) ? selectedIndex : undefined;
    }

    changeLanguage(event) {
        let language = this.getLanguageList()[event.index];

        if (this.props.onChange) {
            this.props.onChange({
                target: {
                    value: language
                }
            });
        }
    }

    getLanguageList() {
        switch(this.props.type) {
            case 'supported':
                return this.props.supportedLanguages;
            case 'allowed':
                return this.props.allowedLanguages;
            case 'custom':
                return this.props.customList;
        }
    }
}

export default connect((store) => {
    return {
        allowedLanguages: store.config.allowedLanguages,
        supportedLanguages: store.config.supportedLanguages
    };
})(LanguageSelector);
