import _ from 'lodash';

import Reducer from 'reducers/reducer';
import sessionStore from 'lib-app/session-store';

class ConfigReducer extends Reducer {

    getInitialState() {
        return {
            language: sessionStore.getItem('language')
        };
    }

    getTypeHandlers() {
        return {
            'CHANGE_LANGUAGE': this.onLanguageChange,
            'INIT_CONFIGS_FULFILLED': this.onInitConfigs
        };
    }

    onLanguageChange(state, payload) {
        sessionStore.setItem('language', payload);

        return _.extend({}, state, {
            language: payload
        });
    }

    onInitConfigs(state, payload) {
        sessionStore.storeConfigs(payload.data);

        return _.extend({}, state, payload.data);
    }
}

export default ConfigReducer.getInstance();