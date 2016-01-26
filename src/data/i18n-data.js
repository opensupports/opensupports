import keys         from 'data/i18n-keys'

let languages = [
    'en',
    'es'
];


let i18nData = function (key, lang) {
    let langIndex = languages.indexOf(lang);

    return keys[key][langIndex];
};

export default i18nData