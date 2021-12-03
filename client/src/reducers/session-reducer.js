import _ from 'lodash';
import Reducer from 'reducers/reducer';
import sessionStore from 'lib-app/session-store';

class SessionReducer extends Reducer {

    getInitialState() {
        return {
            initDone: false,
            logged: false,
            pending: false,
            failed: false,
            verify: null,
            loginAttempts: 0
        };
    }

    getTypeHandlers() {
        return {
            'LOGIN_PENDING': this.onLoginPending,
            'LOGIN_FULFILLED': this.onLoginCompleted.bind(this),
            'LOGIN_REJECTED': this.onLoginFailed,
            'LOGOUT_FULFILLED': this.onLogout,
            'VERIFY': this.onVerify,
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
            staff: payload.data.staff,
            userId: payload.data.userId,
            loginAttempts: 0
        });
    }

    onLoginFailed(state, payload) {
        return _.extend({}, state, {
            failMessage: payload.message,
            logged: false,
            pending: false,
            failed: true,
            loginAttempts: state.loginAttempts + 1
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
            failed: false,
            userId: payload.data.userId,
            staff: payload.data.staff
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
                isStaff: resultData.staff ? 1 : 0,
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
            userTickets: userData.tickets,
            userSendEmailOnNewTicket: userData.sendEmailOnNewTicket * 1,
            userCustomFields: userData.customfields,
            userUsers: userData.users
        });
    }

    onSessionChecked(state) {
        let userData = sessionStore.getUserData();
        let userId = sessionStore.getSessionData().userId;

        return _.extend({}, state, {
            initDone: true,
            logged: true,
            staff: userData.staff,
            userName: userData.name,
            userEmail: userData.email,
            userProfilePic: userData.profilePic,
            userLevel: userData.level,
            userDepartments: userData.departments,
            userTickets: userData.tickets,
            userId: userId,
            userSendEmailOnNewTicket: userData.sendEmailOnNewTicket * 1,
            userCustomFields: userData.customfields
        });
    }

    onVerify(state, payload) {
        return _.extend({}, state, {
            verify: (payload) ? 'success' : 'failed'
        });
    }
}

export default SessionReducer.getInstance();
