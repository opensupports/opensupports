import Reflux from 'reflux';

const UserActions = Reflux.createActions([
	'checkLoginStatus',
	'login',
	'logout',
	'recoverPassword'
]);

export default UserActions;