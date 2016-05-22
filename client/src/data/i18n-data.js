const englishLanguage = require('data/languages/en');
const spanishLanguage = require('data/languages/es');

const languages = {
    'us': englishLanguage,
    'es': spanishLanguage
};

const i18nData = function (key, lang) {
    return languages[lang][key];
};

export default i18nData
