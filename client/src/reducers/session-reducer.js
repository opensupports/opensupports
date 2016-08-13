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
            'LOGIN_FULFILLED': this.onLoginCompleted.bind(this),
            'LOGIN_REJECTED': this.onLoginFailed,
            'LOGOUT_FULFILLED': this.onLogout,
            'CHECK_SESSION_REJECTED': (state) => { return _.extend({}, state, {initDone: true})},
            'SESSION_CHECKED': (state) => { return _.extend({}, state, {initDone: true, logged: true})},
            'LOGIN_AUTO_FULFILLED': this.onAutoLogin.bind(this),
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
        this.storeLoginResultData(payload.data);

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
            initDone: true,
            logged: false,
            pending: false,
            failed: false
        });
    }

    onAutoLogin(state, payload) {
        this.storeLoginResultData(payload.data);

        return _.extend({}, state, {
            initDone: true,
            logged: true,
            pending: false,
            failed: false
        });
    }

    onAutoLoginFail(state) {
        sessionStore.closeSession();
        sessionStore.clearRememberData();

        return _.extend({}, state, {
            initDone: true
        });
    }

    storeLoginResultData(resultData) {
        if (resultData.rememberToken) {
            sessionStore.storeRememberData({
                token: resultData.rememberToken,
                userId: resultData.userId,
                expiration: resultData.rememberExpiration
            });
        } else {
            sessionStore.createSession(resultData.userId, resultData.token);
        }
    }
}

export default SessionReducer.getInstance();