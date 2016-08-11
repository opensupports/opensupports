import _ from 'lodash';
import Reducer from 'reducers/reducer';
import sessionStore from 'lib-app/session-store';

class SessionReducer extends Reducer {

    getInitialState() {
        return {
            initDone: false,
            logged: false,
            pending: false,
            failed: false
        };
    }

    getTypeHandlers() {
        return {
            'LOGIN_PENDING': this.onLoginPending,
            'LOGIN_FULFILLED': this.onLoginCompleted,
            'LOGIN_REJECTED': this.onLoginFailed,
            'LOGOUT_FULFILLED': this.onLogout,
            'CHECK_SESSION_REJECTED': (state) => { return _.extend({}, state, {initDone: true})},
            'SESSION_CHECKED': (state) => { return _.extend({}, state, {initDone: true})},
            'LOGIN_AUTO_FULFILLED': this.onAutoLogin,
            'LOGIN_AUTO_REJECTED': this.onAutoLoginFail
        };
    }

    onLoginPending(state) {
        return _.extend({}, state, {
            logged: false,
            pending: true,
            failed: false
        });
    }

    onLoginCompleted(state, payload) {
        if (payload.data.rememberToken) {
            sessionStore.storeRememberData({
                token: payload.data.rememberToken,
                userId: payload.data.userId,
                expiration: payload.data.rememberExpiration
            });
        } else {
            sessionStore.createSession(payload.data.userId, payload.data.token);
        }
        
        return _.extend({}, state, {
            logged: true,
            pending: false,
            failed: false
        });
    }

    onLoginFailed(state) {
        return _.extend({}, state, {
            logged: false,
            pending: false,
            failed: true
        });
    }

    onLogout(state) {
        sessionStore.closeSession();
        sessionStore.clearRememberData();

        return _.extend({}, state, {
            logged: false,
            pending: false,
            failed: false
        });
    }

    onAutoLogin() {
        return _.extend({}, state, {
            initDone: true
        });
    }

    onAutoLoginFail() {
        sessionStore.closeSession();
        sessionStore.clearRememberData();

        return _.extend({}, state, {
            initDone: true
        });
    }
}

export default SessionReducer.getInstance();