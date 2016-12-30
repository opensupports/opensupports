import _ from 'lodash';

import Reducer from 'reducers/reducer';
import sessionStore from 'lib-app/session-store';

class ConfigReducer extends Reducer {

    getInitialState() {
        return {
            language: sessionStore.getItem('language'),
            initDone: false
        };
    }

    getTypeHandlers() {
        return {
            'CHANGE_LANGUAGE': this.onLanguageChange,
            'INIT_CONFIGS_FULFILLED': this.onInitConfigs,
            'UPDATE_DATA_FULFILLED': this.onInitConfigs
        };
    }

    onLanguageChange(state, payload) {
        sessionStore.setItem('language', payload);

        return _.extend({}, state, {
            language: payload
        });
    }

    onInitConfigs(state, payload) {
        const currentLanguage = sessionStore.getItem('language');

        sessionStore.storeConfigs(_.extend({}, payload.data, {
            language: currentLanguage || payload.language
        }));

        return _.extend({}, state, payload.data, {
            language: currentLanguage || payload.language,
            initDone: true
        });
    }
}

export default ConfigReducer.getInstance();