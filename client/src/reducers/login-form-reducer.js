import _ from 'lodash';

import Reducer from 'reducers/reducer';

class loginFormReducer extends Reducer {

    getInitialState() {
        return {
            loginFormShown: false,
        };
    }

    getTypeHandlers() {
        return {
            'SHOW_LOGIN_FORM': this.showLoginForm,
            'HIDE_LOGIN_FORM': this.hideLoginForm,
        };
    }

    showLoginForm(state, payload) {
        return _.extend({}, state, {
            loginFormShown: payload
        });
    }

    hideLoginForm(state, payload) {
        return _.extend({}, state, {
            loginFormShown: payload
        });
    }
}

export default loginFormReducer.getInstance();

