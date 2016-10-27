import _ from 'lodash';

import Reducer from 'reducers/reducer';
import sessionStore from 'lib-app/session-store';

class AdminDataReducer extends Reducer {

    getInitialState() {
        return {
            customResponses: [],
            customResponsesLoaded: false
        };
    }

    getTypeHandlers() {
        return {
            'CUSTOM_RESPONSES_FULFILLED': this.onCustomResponses,
            'SESSION_CHECKED': this.onSessionChecked
        };
    }

    onCustomResponses(state, payload) {
        sessionStore.setItem('customResponses', JSON.stringify(payload.data));

        return _.extend({}, state, {
            customResponses: payload.data,
            customResponsesLoaded: true
        });
    }

    onSessionChecked(state) {
        const customResponses = sessionStore.getItem('customResponses');

        return _.extend({}, state, {
            customResponses: JSON.parse(customResponses),
            customResponsesLoaded: true
        });
    }
}

export default AdminDataReducer.getInstance();