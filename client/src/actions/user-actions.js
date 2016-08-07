import Reflux from 'reflux';

const UserActions = Reflux.createActions([
	'checkLoginStatus',
	'login',
	'logout',
	'signup',
	'sendRecoverPassword',
	'recoverPassword'
]);

export default UserActions;