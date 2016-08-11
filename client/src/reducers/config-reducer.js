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
            'CHANGE_LANGUAGE': this.onLanguageChange
        };
    }

    onLanguageChange(state, payload) {
        sessionStore.setItem('language', payload);

        return _.extend({}, state, {
            language: payload
        });
    }
}

export default ConfigReducer.getInstance();