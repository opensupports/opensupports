const Reflux = require('reflux');
const API = require('lib-app/api-call');

const UserActions = require('actions/user-actions');

let UserStore = Reflux.createStore({

	init() {
		this.user = null;
		this.hasBeenChecked = false;

		this.listenTo(UserActions.checkLoginStatus, this.checkLoginStatus);
		this.listenTo(UserActions.login, this.loginUser);
		this.listenTo(UserActions.logout, this.logoutUser);
	},

    loginUser(loginData) {
		API.call('user/login', loginData, result => {
			console.log(result);

			API.setConfig(result.userId, result.token);
        });
	}
});

export default UserStore;