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
        this.listenTo(UserActions.logout, this.logoutUser);
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
    }
});

export default UserStore;