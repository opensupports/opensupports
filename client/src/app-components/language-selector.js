import React from 'react';
import classNames from 'classnames';
import DropDown from 'core-components/drop-down';

const codeLanguages = {
    'English': 'us',
    'Spanish': 'es',
    'German': 'de',
    'French': 'fr',
    'Chinese': 'cn',
    'Turkish': 'tr',
    'Indian': 'in'
};
const languages = Object.keys(codeLanguages);
const languageCodes = languages.map((key) => { return codeLanguages[key]; }).concat(['en']);

class LanguageSelector extends React.Component {
    static propTypes = {
        value: React.PropTypes.oneOf(languageCodes)
    };

    render() {
        return (
            <DropDown {...this.getProps()}/>
        );
    }

    getProps() {
        return {
            className: this.getClass(),
            items: this.getLanguageList(),
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

    getLanguageList() {
        return languages.map((language) => {
            return {
                content: language,
                icon: codeLanguages[language]
            };
        });
    }

    getSelectedIndex() {
        let selectedIndex = languages.map((key) => codeLanguages[key]).indexOf(this.getPropLanguage());

        return (selectedIndex != -1) ? selectedIndex : undefined;
    }

    getPropLanguage() {
        let language = this.props.value;

        if (language === 'en') {
            language = 'us';
        }

        return language;
    }

    changeLanguage(event) {
        let language = codeLanguages[languages[event.index]];

        if (language === 'us') {
            language = 'en';
        }

        if (this.props.onChange) {
            this.props.onChange({
                target: {
                    value: language
                }
            });
        }
    }
}

export default LanguageSelector;