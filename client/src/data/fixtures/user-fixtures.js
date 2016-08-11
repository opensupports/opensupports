module.exports = [
    {
        path: '/user/login',
        time: 1000,
        response: function (data) {
            let response;

            if (data.password === 'valid' || (data.rememberToken === 'aa41efe0a1b3eeb9bf303e4561ff8392' && data.userId === 12)) {
                response = {
                    status: 'success',
                    data: {
                        'userId': 12,
                        'token': 'cc6b4921e6733d6aafe284ec0d7be57e',
                        'rememberToken': (data.remember) ? 'aa41efe0a1b3eeb9bf303e4561ff8392' : null,
                        'rememberExpiration': (data.remember) ? 2018 : 0
                    }
                };
            } else {
                response = {
                    status: 'fail',
                    message: 'Invalid Credientals'
                };
            }

            return response;
        }
    },
    {
        path: '/user/logout',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/user/check-session',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {
                    sessionActive: true
                }
            };
        }
    },
    {
        path: '/user/send-recover-password',
        time: 2000,
        response: function (data) {

            if (data.email.length > 10) {
                return {
                    status: 'success',
                    data: {}
                };
            } else {
                return {
                    status: 'fail',
                    message: 'Email not exists',
                    data: {}
                };
            }
        }
    },
    {
        path: '/user/recover-password',
        time: 1000,
        response: function (data) {

            if (data.password.length > 6) {
                return {
                    status: 'success',
                    data: {}
                };
            } else {
                return {
                    status: 'fail',
                    message: 'Invalid token',
                    data: {}
                };
            }
        }
    },
    {
        path: '/user/signup',
        time: 1000,
        response: function (data) {

            if (data.email.length > 15) {
                return {
                    status: 'success',
                    data: {}
                };
            } else {
                return {
                    status: 'fail',
                    message: 'Email already exists',
                    data: {}
                };
            }
        }
    }
];
