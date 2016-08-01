import Reflux from 'reflux';

const UserActions = Reflux.createActions([
	'checkLoginStatus',
	'login',
	'logout',
	'sendRecover',
	'recoverPassword'
]);

export default UserActions;