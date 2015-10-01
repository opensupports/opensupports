import keys         from 'data/i18n-keys'

var languages = [
    'en',
    'es'
];


var i18nData = function (key, lang) {
    var langIndex = languages.indexOf(lang);

    return keys[key][langIndex];
};

export default i18nData