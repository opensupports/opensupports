import languageList from 'data/language-list';

const i18nData = function (key, lang) {
    return (languageList[lang] && languageList[lang].data[key]) || languageList['en'].data[key] || key;
};

export default i18nData
