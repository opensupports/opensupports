import Reflux             from 'reflux';

import UserActions        from 'actions/user-actions';

var UserStore = Reflux.createStore({

	init() {
		this.user = null;
		this.hasBeenChecked = false;

		this.listenTo(UserActions.checkLoginStatus, this.checkLoginStatus);
		this.listenTo(UserActions.login, this.loginUser);
		this.listenTo(UserActions.logout, this.logoutUser);
	},

    loginUser(email, password) {
        console.log(email + ':' + password);
	}
});

export default UserStore;