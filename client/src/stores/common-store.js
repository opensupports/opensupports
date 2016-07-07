import Reflux             from 'reflux';

import CommonActions      from 'actions/common-actions';

let CommonStore = Reflux.createStore({

    init() {
        this.language = 'us';

        this.listenTo(CommonActions.changeLanguage, this.changeLanguage);
        this.listenTo(CommonActions.logged, this.logged);
        this.listenTo(CommonActions.loggedOut, this.loggedOut);
    },

    changeLanguage(lang) {
        this.language = lang;
        this.trigger('i18n');
    },
    
    logged() {
        this.trigger('logged');
    },

    loggedOut() {
        this.trigger('loggedOut');
    },
    
    isLogged() {
        return this.logged()
    }
});

export default CommonStore;
