import Reflux             from 'reflux';
import APIUtils           from 'lib/APIUtils';

import UserActions        from 'actions/user-actions';

var UserStore = Reflux.createStore({

	init() {
		this.user = null;
		this.hasBeenChecked = false;

		this.listenTo(UserActions.checkLoginStatus, this.checkLoginStatus);
		this.listenTo(UserActions.login, this.loginUser);
		this.listenTo(UserActions.logout, this.logoutUser);
	},

    loginUser(loginData) {
        APIUtils.post('user/login').then(result => {
            console.log(result);
        });
	}
});

export default UserStore;