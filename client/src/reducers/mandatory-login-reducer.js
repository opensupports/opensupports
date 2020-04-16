import _ from 'lodash';

import Reducer from 'reducers/reducer';

class MandatoryLoginReducer extends Reducer {

    getInitialState() {
        return {
            showLoginForm: false,
        };
    }

    getTypeHandlers() {
        return {
            'CHANGE_SHOW_LOGIN_FORM': this.onShowLoginFormChange,
        };
    }

    onShowLoginFormChange(state, payload) {
        return _.extend({}, state, {
            showLoginForm: payload
        });
    }
}

export default MandatoryLoginReducer.getInstance();

