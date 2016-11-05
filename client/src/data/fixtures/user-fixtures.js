module.exports = [
    {
        path: '/user/login',
        time: 1000,
        response: function (data) {
            let response;

            if (data.password === 'valid' || (data.rememberToken === 'aa41efe0a1b3eeb9bf303e4561ff8392' && data.userId == 12)) {
                response = {
                    status: 'success',
                    data: {
                        'staff': data.staff,
                        'userId': 12,
                        'token': 'cc6b4921e6733d6aafe284ec0d7be57e',
                        'rememberToken': (data.remember) ? 'aa41efe0a1b3eeb9bf303e4561ff8392' : null,
                        'rememberExpiration': (data.remember) ? 20180806 : 0
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
    },
    {
        path: '/user/edit-email',
        time: 1000,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/user/edit-password',
        time: 1000,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/user/get',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {
                    name: 'Haskell Curry',
                    email: 'haskell@lambda.com',
                    tickets: [
                        {
                            ticketNumber: '445441',
                            title: 'Problem with installation',
                            content: 'I had a problem with the installation of the php server',
                            department: {
                                id: 2,
                                name: 'Technical Issues'
                            },
                            date: '20160416',
                            file: 'http://www.opensupports.com/some_file.zip',
                            language: 'en',
                            unread: true,
                            closed: false,
                            priority: 'low',
                            author: {
                                id: 12,
                                name: 'Haskell Curry',
                                email: 'haskell@lambda.com'
                            },
                            owner: {
                                id: 15,
                                name: 'Steve Jobs',
                                email: 'steve@jobs.com'
                            },
                            events: [
                                {
                                    type: 'ASSIGN',
                                    date: '20150409',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'COMMENT',
                                    date: '20150409',
                                    content: 'Do you have apache installed? It generally happens if you dont have apache.',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'UN_ASSIGN',
                                    date: '20150410',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'DEPARTMENT_CHANGED',
                                    date: '20150411',
                                    content: 'System support',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'COMMENT',
                                    date: '20150412',
                                    content: 'I have already installed apache, but the problem persists',
                                    author: {
                                        name: 'Haskell Curry',
                                        steve: 'haskell@lambda.com',
                                        staff: false
                                    }
                                },
                                {
                                    type: 'PRIORITY_CHANGED',
                                    date: '20150413',
                                    content: 'MEDIUM',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'COMMENT',
                                    date: '20150511',
                                    content: 'Thanks!, I solved it by myself',
                                    author: {
                                        name: 'Haskell Curry',
                                        steve: 'haskell@lambda.com',
                                        staff: false
                                    }
                                },
                                {
                                    type: 'CLOSE',
                                    date: '20150513',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'RE_OPEN',
                                    date: '20151018',
                                    author: {
                                        name: 'Haskell Curry',
                                        email: 'haskell@lambda.com',
                                        staff: false
                                    }
                                }
                            ]
                        },
                        {
                            ticketNumber: '878552',
                            title: 'Lorem ipsum door',
                            content: 'I had a problem with the installation of the php server',
                            department: {
                                id: 1,
                                name: 'Sales Support'
                            },
                            date: '20160415',
                            file: 'http://www.opensupports.com/some_file.zip',
                            language: 'en',
                            unread: false,
                            closed: false,
                            priority: 'medium',
                            author: {
                                name: 'Haskell Curry',
                                email: 'haskell@lambda.com'
                            },
                            owner: {
                                name: 'Steve Jobs'
                            },
                            events: [
                                {
                                    type: 'ASSIGN',
                                    date: '20150409',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'COMMENT',
                                    date: '20150409',
                                    content: 'Do you have apache installed? It generally happens if you dont have apache.',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'UN_ASSIGN',
                                    date: '20150410',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'DEPARTMENT_CHANGED',
                                    date: '20150411',
                                    content: 'System support',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'COMMENT',
                                    date: '20150412',
                                    content: 'I have already installed apache, but the problem persists',
                                    author: {
                                        name: 'Haskell Curry',
                                        steve: 'haskell@lambda.com',
                                        staff: false
                                    }
                                },
                                {
                                    type: 'PRIORITY_CHANGED',
                                    date: '20150413',
                                    content: 'MEDIUM',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'COMMENT',
                                    date: '20150511',
                                    content: 'Thanks!, I soved it by myself',
                                    author: {
                                        name: 'Haskell Curry',
                                        steve: 'haskell@lambda.com',
                                        staff: false
                                    }
                                },
                                {
                                    type: 'CLOSE',
                                    date: '20150513',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'RE_OPEN',
                                    date: '20151018',
                                    author: {
                                        name: 'Haskell Curry',
                                        email: 'haskell@lambda.com',
                                        staff: false
                                    }
                                }
                            ]
                        },
                        {
                            ticketNumber: '118551',
                            title: 'Lorem ipsum door',
                            content: 'I had a problem with the installation of the php server',
                            department: {
                                id: 1,
                                name: 'Sales Support'
                            },
                            date: '20150409',
                            file: 'http://www.opensupports.com/some_file.zip',
                            language: 'en',
                            unread: false,
                            closed: false,
                            priority: 'high',
                            author: {
                                name: 'Haskell Curry',
                                email: 'haskell@lambda.com'
                            },
                            owner: {
                                name: 'Steve Jobs'
                            },
                            events: [
                                {
                                    type: 'ASSIGN',
                                    date: '20150409',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'COMMENT',
                                    date: '20150409',
                                    content: 'Do you have apache installed? It generally happens if you dont have apache.',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'UN_ASSIGN',
                                    date: '20150410',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'DEPARTMENT_CHANGED',
                                    date: '20150411',
                                    content: 'System support',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'COMMENT',
                                    date: '20150412',
                                    content: 'I have already installed apache, but the problem persists',
                                    author: {
                                        name: 'Haskell Curry',
                                        steve: 'haskell@lambda.com',
                                        staff: false
                                    }
                                },
                                {
                                    type: 'PRIORITY_CHANGED',
                                    date: '20150413',
                                    content: 'MEDIUM',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'COMMENT',
                                    date: '20150511',
                                    content: 'Thanks!, I soved it by myself',
                                    author: {
                                        name: 'Haskell Curry',
                                        steve: 'haskell@lambda.com',
                                        staff: false
                                    }
                                },
                                {
                                    type: 'CLOSE',
                                    date: '20150513',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'RE_OPEN',
                                    date: '20151018',
                                    author: {
                                        name: 'Haskell Curry',
                                        email: 'haskell@lambda.com',
                                        staff: false
                                    }
                                }
                            ]
                        }
                    ]
                }
            };
        }
    }
];