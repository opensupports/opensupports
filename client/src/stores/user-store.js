const Reflux = require('reflux');
const API = require('lib-app/api-call');
const sessionStore = require('lib-app/session-store');

const UserActions = require('actions/user-actions');
const CommonActions = require('actions/common-actions');

const UserStore = Reflux.createStore({

    init() {
        this.user = null;

        this.listenTo(UserActions.checkLoginStatus, this.checkLoginStatus);
        this.listenTo(UserActions.login, this.loginUser);
        this.listenTo(UserActions.signup, this.signupUser);
        this.listenTo(UserActions.logout, this.logoutUser);
        this.listenTo(UserActions.recoverPassword, this.recoverPassword);
        this.listenTo(UserActions.sendRecoverPassword, this.sendRecoverPassword);
    },
    
    initSession() {
        return API.call({
            path: 'user/check-session',
            data: {}
        }).then(this.tryLoginIfSessionIsInactive);
    },

    tryLoginIfSessionIsInactive(result) {
        if (!result.data.sessionActive) {
            if (sessionStore.isRememberDataExpired()) {
                return this.logoutUser();
            } else {
                return this.loginWithRememberData();
            }
        }
    },

    signupUser(signupData) {
        return API.call({
            path: 'user/signup',
            data: signupData
        }).then(this.handleSignupSuccess, this.handleSignupFail);
    },

    loginUser(loginData) {
        let onSuccessLogin = (loginData.remember) ? this.handleLoginSuccessWithRemember : this.handleLoginSuccess;
        let onFailedLogin = (loginData.isAutomatic) ? null : this.handleLoginFail;

        return API.call({
            path: 'user/login',
            data: loginData
        }).then(onSuccessLogin, onFailedLogin);
    },

    logoutUser() {
        return API.call({
            path: 'user/logout'
        }).then(() => {
            sessionStore.closeSession();
            sessionStore.clearRememberData();
            CommonActions.loggedOut();
            this.trigger('LOGOUT');
        });
    },

    sendRecoverPassword(recoverData) {
        return API.call({
            path: 'user/send-recover-password',
            data: recoverData
        }).then(() => {
            this.trigger('SEND_RECOVER_SUCCESS');
        }, () => {
            this.trigger('SEND_RECOVER_FAIL')
        });
    },

    recoverPassword(recoverData) {
        return API.call({
            path: 'user/recover-password',
            data: recoverData
        }).then(() => {
            this.trigger('VALID_RECOVER');
        }, () => {
            this.trigger('INVALID_RECOVER')
        });
    },

    isLoggedIn() {
        return sessionStore.isLoggedIn();
    },

    loginWithRememberData() {
        let rememberData = sessionStore.getRememberData();

        return this.loginUser({
            userId: rememberData.userId,
            rememberToken: rememberData.token,
            isAutomatic: true
        });
    },

    handleLoginSuccessWithRemember(result) {
        sessionStore.storeRememberData({
            token: result.data.rememberToken,
            userId: result.data.userId,
            expiration: result.data.rememberExpiration
        });

        this.handleLoginSuccess(result)
    },

    handleLoginSuccess(result) {
        sessionStore.createSession(result.data.userId, result.data.token);
        CommonActions.logged();
        this.trigger('LOGIN_SUCCESS');
    },

    handleLoginFail() {
        this.trigger('LOGIN_FAIL');
    },

    handleSignupSuccess() {
        this.trigger('SIGNUP_SUCCESS');
    },

    handleSignupFail() {
        this.trigger('SIGNUP_FAIL');
    }
});

export default UserStore;