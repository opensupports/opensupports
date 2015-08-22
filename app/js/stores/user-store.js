import Reflux             from 'reflux';

import CurrentUserActions from '../actions/CurrentUserActions';

var UserStore = Reflux.createStore({

	init() {
		this.user = null;
		this.hasBeenChecked = false;

		this.listenTo(CurrentUserActions.checkLoginStatus, this.checkLoginStatus);
		this.listenTo(CurrentUserActions.login, this.loginUser);
		this.listenTo(CurrentUserActions.logout, this.logoutUser);
	},

	loginUser() {

	}
});

export default UserStore;