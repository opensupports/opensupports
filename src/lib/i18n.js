import MessageFormat      from 'messageformat';

import CommonStore        from 'stores/common-store';
import i18nData           from 'data/i18n-data';

var mf = new MessageFormat('en');

var i18n = function (key, params = null) {
    var i18nKey = i18nData(key, CommonStore.language);
    var message = mf.compile(i18nKey);

    return message(params);
};

export default i18n;
