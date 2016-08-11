import MessageFormat      from 'messageformat';

import store              from 'app/store';
import i18nData           from 'data/i18n-data';

let mf = new MessageFormat('en');

let i18n = function (key, params = null) {
    let i18nKey = i18nData(key, store.getState().config.language);
    let message = mf.compile(i18nKey);

    return message(params);
};

export default i18n;
