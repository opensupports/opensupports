import Reflux from 'reflux';

const UserActions = Reflux.createActions([
	'checkLoginStatus',
	'login',
	'logout',
	'sendRecoverPassword',
	'recoverPassword'
]);

export default UserActions;