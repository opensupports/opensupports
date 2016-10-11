import _ from 'lodash';

import Reducer from 'reducers/reducer';
//import sessionStore from 'lib-app/session-store';

class AdminDataReducer extends Reducer {

    getInitialState() {
        return {
            customResponses: [],
            customResponsesLoaded: false
        };
    }

    getTypeHandlers() {
        return {
            'CUSTOM_RESPONSES_FULFILLED': this.onCustomResponses
        };
    }

    onCustomResponses(state, payload) {
        //sessionStore.setItem('language', payload);

        return _.extend({}, state, {
            customResponses: payload.data,
            customResponsesLoaded: true
        });
    }
}

export default AdminDataReducer.getInstance();