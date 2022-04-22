import _ from 'lodash';

import API from 'lib-app/api-call';
import AdminDataActions from 'actions/admin-data-actions';
import ConfigActions from 'actions/config-actions';
import sessionStore from 'lib-app/session-store';
import store from 'app/store';

export default {

    login(loginData) {
        return {
            type: 'LOGIN',
            payload: new Promise((resolve, reject) => {
                let loginCall = () => {
                    API.call({
                        path: '/user/login',
                        data: _.extend(loginData, {remember: loginData.remember * 1})
                    }).then((result) => {
                        store.dispatch(this.getUserData(result.data.userId, result.data.token, result.data.staff))
                            .then(() => store.dispatch(ConfigActions.updateData()))
                            .then(() => {
                                if(result.data.staff) {
                                    store.dispatch(AdminDataActions.retrieveCustomResponses());
                                    store.dispatch(AdminDataActions.retrieveStaffMembers());
                                }
                            });

                        resolve(result);
                    }).catch((result) => {
                        if(result.message === 'SESSION_EXISTS') {
                            API.call({
                                path: '/user/logout',
                                data: {}
                            }).then(loginCall);
                        } else {
                            reject(result);
                        }
                    })
                };

                loginCall();
            })
        };
    },

    autoLogin() {
        const rememberData = sessionStore.getRememberData();

        return {
            type: 'LOGIN_AUTO',
            payload: API.call({
                path: '/user/login',
                data: {
                    userId: rememberData.userId,
                    rememberToken: rememberData.token,
                    staff: rememberData.isStaff,
                    remember: 1,
                }
            }).then((result) => {
                store.dispatch(this.getUserData(result.data.userId, result.data.token, result.data.staff));
                
                return result;
            })
        };
    },

    logout() {
        return {
            type: 'LOGOUT',
            payload: API.call({
                path: '/user/logout',
                data: {}
            })
        };
    },

    getUserData(userId, token, staff) {
        let data  = {};

        if (userId && token) {
            data = {
                csrf_userid: userId,
                csrf_token: token
            };
        }

        return {
            type: 'USER_DATA',
            payload: API.call({
                path: (staff) ? '/staff/get' : '/user/get',
                data: data
            })
        }
    },

    verify(value) {
        return {
            type: 'VERIFY',
            payload: value
        };
    },

    checkSession() {
        return {
            type: 'CHECK_SESSION',
            payload: new Promise((resolve, reject) => {
                API.call({
                    path: '/user/check-session',
                    data: {}
                }).then((result) => {
                    if (!result.data.sessionActive) {
                        if (sessionStore.isRememberDataExpired()) {
                            store.dispatch({
                                type: 'LOGOUT_FULFILLED'
                            });
                        } else {
                            store.dispatch(this.autoLogin());
                        }

                        resolve(result);
                    } else if(sessionStore.isLoggedIn()) {
                        store.dispatch({
                            type: 'SESSION_CHECKED'
                        });

                        resolve(result);
                    } else {
                        reject(result);
                    }
                });
            })
        }
    }
};
