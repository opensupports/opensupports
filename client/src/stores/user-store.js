const Reflux = require('reflux');
const API = require('lib-app/api-call');
const SessionStore = require('lib-app/session-store');

const UserActions = require('actions/user-actions');
const CommonActions = require('actions/common-actions');

const UserStore = Reflux.createStore({

    init() {
        this.user = null;

        this.listenTo(UserActions.checkLoginStatus, this.checkLoginStatus);
        this.listenTo(UserActions.login, this.loginUser);
        this.listenTo(UserActions.logout, this.logoutUser);
    },

    loginUser(loginData) {
        API.call({
            path: 'user/login',
            data: loginData,
            onSuccess: this.handleLoginSuccess,
            onFail: this.handleLoginFail
        });
    },

    logoutUser() {
        API.call({
            path: 'user/logout',
            onSuccess: function () {
                SessionStore.closeSession();
                this.trigger('LOGOUT');
                CommonActions.loggedOut();
            }.bind(this)
        });
    },

    isLoggedIn() {
        return SessionStore.isLoggedIn();
    },

    handleLoginSuccess(result) {
        SessionStore.createSession(result.data.userId, result.data.token);
        this.trigger('LOGIN_SUCCESS');
        CommonActions.logged();
    },

    handleLoginFail() {
        this.trigger('LOGIN_FAIL');
    }
});

export default UserStore;