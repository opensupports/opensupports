'use strict';

import Reflux from 'reflux';

var CurrentUserActions = Reflux.createActions([

  'checkLoginStatus',
  'login',
  'logout'

]);

export default CurrentUserActions;