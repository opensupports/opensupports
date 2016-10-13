import _ from 'lodash';

import Reducer from 'reducers/reducer';

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
        return _.extend({}, state, {
            customResponses: payload.data,
            customResponsesLoaded: true
        });
    }
}

export default AdminDataReducer.getInstance();