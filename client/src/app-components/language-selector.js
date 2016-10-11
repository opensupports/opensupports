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

class LanguageSelector extends React.Component {
    static propTypes = {
        language: React.PropTypes.oneOf(languages)
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
            selectedIndex: languages.map((key) => codeLanguages[key]).indexOf(this.getPropLanguage()),
            onChange: this.changeLanguage.bind(this)
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

    getPropLanguage() {
        let language = this.props.language;

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
            this.props.onChange(language);
        }
    }
}

export default LanguageSelector;