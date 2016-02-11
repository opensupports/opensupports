module.exports = [
    {
        path: 'user/login',
        time: 1000,
        response: function (data) {
            let response;

            if (data.password === 'invalid') {
                response = {
                    status: 'fail',
                    message: 'Invalid Credientals'
                };
            } else {
                response = {
                    status: 'success',
                    data: {
                        'userId': 12,
                        'token': 'cc6b4921e6733d6aafe284ec0d7be57e'
                    }
                };
            }

            return response;
        }
    }
];
