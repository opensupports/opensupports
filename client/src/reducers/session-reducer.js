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
            'USER_DATA_FULFILLED': this.onUserDataRetrieved,
            'CHECK_SESSION_REJECTED': (state) => { return _.extend({}, state, {initDone: true})},
            'SESSION_CHECKED': this.onSessionChecked,
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
            failed: false,
            staff: payload.data.staff
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
        }

        sessionStore.createSession(resultData.userId, resultData.token);
    }

    onUserDataRetrieved(state, payload) {
        let userData = payload.data;
        
        sessionStore.storeUserData(payload.data);
        
        return _.extend({}, state, {
            staff: userData.staff,
            userName: userData.name,
            userEmail: userData.email,
            userProfilePic: userData.profilePic,
            userLevel: userData.level,
            userDepartments: userData.departments,
            userTickets: userData.tickets
        });
    }
    
    onSessionChecked(state) {
        let userData = sessionStore.getUserData();
        
        return _.extend({}, state, {
            initDone: true, 
            logged: true,
            staff: userData.staff,
            userName: userData.name,
            userEmail: userData.email,
            userProfilePic: userData.profilePic,
            userLevel: userData.level,
            userDepartments: userData.departments,
            userTickets: userData.tickets
        });
    }
}

export default SessionReducer.getInstance();