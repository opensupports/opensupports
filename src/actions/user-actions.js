import Reflux from 'reflux';

let UserActions = Reflux.createActions([
	'checkLoginStatus',
	'login',
	'logout'
]);

export default UserActions;