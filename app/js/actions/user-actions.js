import Reflux from 'reflux';

var UserActions = Reflux.createActions([
	'checkLoginStatus',
	'login',
	'logout'
]);

export default UserActions;