'use strict';

import Reflux             from 'reflux';

import CurrentUserActions from '../actions/CurrentUserActions';
import AuthAPI            from '../utils/AuthAPI';

var CurrentUserStore = Reflux.createStore({

  init() {
    this.user = null;
    this.hasBeenChecked = false;

    this.listenTo(CurrentUserActions.checkLoginStatus, this.checkLoginStatus);
    this.listenTo(CurrentUserActions.login, this.loginUser);
    this.listenTo(CurrentUserActions.logout, this.logoutUser);
  },

  setUser(user, cb = function(){}) {
    this.user = user;
    cb(null, this.user);
    this.trigger(null, this.user);
  },

  throwError(err, cb) {
    cb(err);
    this.trigger(err);
  },

  checkLoginStatus(cb = function(){}) {
    if ( this.user ) {
      this.setUser(this.user, cb);
    } else {
      AuthAPI.checkLoginStatus().then(user => {
        this.hasBeenChecked = true;
        this.setUser(user, cb);
      }).catch(err => {
        this.hasBeenChecked = true;
        this.throwError(err, cb);
      });
    }
  },

  loginUser(user, cb = function(){}) {
    AuthAPI.login(user).then(user => {
      this.setUser(user, cb);
    }).catch(err => {
      this.throwError(err, cb);
    });
  },

  logoutUser(cb = function(){}) {
    AuthAPI.logout(this.user).then(() => {
      this.setUser(null, cb);
    });
  }

});

export default CurrentUserStore;