const Reflux = require('reflux');
const API = require('lib-app/api-call');
const sessionStore = require('lib-app/session-store');
const localStore = require('lib-app/local-store');

const UserActions = require('actions/user-actions');
const CommonActions = require('actions/common-actions');

const UserStore = Reflux.createStore({

    init() {
        this.user = null;

        this.listenTo(UserActions.checkLoginStatus, this.checkLoginStatus);
        this.listenTo(UserActions.login, this.loginUser);
        this.listenTo(UserActions.logout, this.logoutUser);

        if (!this.isLoggedIn()) {
            this.loginIfRememberExists();
        }
    },

    loginUser(loginData) {
        API.call({
            path: 'user/login',
            data: loginData,
            onSuccess: (loginData.remember) ? this.handleLoginSuccessWithRemember : this.handleLoginSuccess,
            onFail: (loginData.isAutomatic) ? null : this.handleLoginFail
        });
    },

    logoutUser() {
        API.call({
            path: 'user/logout',
            onSuccess: function () {
                sessionStore.closeSession();
                CommonActions.loggedOut();
                this.trigger('LOGOUT');
            }.bind(this)
        });
    },

    isLoggedIn() {
        return sessionStore.isLoggedIn();
    },

    loginIfRememberExists() {
        let rememberData = localStore.getRememberData();

        if (!localStore.isRememberDataExpired()) {
            UserActions.login({
                userId: rememberData.userId,
                rememberToken: rememberData.token,
                isAutomatic: true
            });
        }
    },

    handleLoginSuccessWithRemember(result) {
        localStore.storeRememberData({
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