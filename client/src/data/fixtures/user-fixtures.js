const _ = require('lodash');

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
                        'rememberExpiration': (data.remember) ? 201808061020 : 0
                    }
                };
            } else {
                response = {
                    status: 'fail',
                    message: 'INVALID_CREDENTIALS'
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
                    data: {
                        staff: true
                    }
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
        path: '/user/verify-token',
        time: 200,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
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
        path: '/user/delete',
        time: 1000,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/user/get-user',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {
                    name: 'Kurt Gödel',
                    email: 'kurt@currycurrylady.hs',
                    verified: false,
                    sendEmailOnNewTicket: true,
                    customfields: [],
                    tickets: _.times(13).map(() => {
                        return {
                            ticketNumber: '118551',
                            title: 'Lorem ipsum door',
                            content: 'I had a problem with the installation of the php server',
                            department: {
                                id: 1,
                                name: 'Sales Support'
                            },
                            date: '201504090001',
                            file: 'some_file.txt',
                            language: 'en',
                            unread: false,
                            closed: false,
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
                                    date: '201504090003',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'COMMENT',
                                    date: '201504090005',
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
                                    date: '201504100009',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'DEPARTMENT_CHANGED',
                                    date: '201504110011',
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
                                    date: '201504120024',
                                    content: 'I have already installed apache, but the problem persists',
                                    author: {
                                        name: 'Haskell Curry',
                                        steve: 'haskell@lambda.com',
                                        staff: false
                                    }
                                },
                                {
                                    type: 'COMMENT',
                                    date: '201505110110',
                                    content: 'Thanks!, I soved it by myself',
                                    author: {
                                        name: 'Haskell Curry',
                                        steve: 'haskell@lambda.com',
                                        staff: false
                                    }
                                },
                                {
                                    type: 'CLOSE',
                                    date: '201505130113',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'RE_OPEN',
                                    date: '201510180114',
                                    author: {
                                        name: 'Haskell Curry',
                                        email: 'haskell@lambda.com',
                                        staff: false
                                    }
                                }
                            ]
                        };
                    })
                }
            }
        }
    },
    {
        path: '/user/get-users',
        time: 100,
        response: function (data) {
            return {
                status: 'success',
                data: {
                    page: data.page,
                    pages: 10,
                    orderBy: 'date',
                    desc: true,
                    search: '',
                    users: [
                        {
                            id: 101,
                            name: 'Haskell Curry',
                            email: 'haskell@currycurrylady.com',
                            tickets: 5,
                            signupDate: 201604151230
                        },
                        {
                            id: 97,
                            name: 'Alan Turing',
                            email: 'turing@currycurrylady.com',
                            tickets: 1,
                            signupDate: 201604011230
                        },
                        {
                            id: 89,
                            name: 'David Hilbert',
                            email: 'hilbert@currycurrylady.com',
                            tickets: 2,
                            signupDate: 201602081230
                        },
                        {
                            id: 83,
                            name: 'Kurt Gödel',
                            email: 'kurt@currycurrylady.com',
                            tickets: 10,
                            signupDate: 201601101230
                        },
                        {
                            id: 79,
                            name: 'Mojzesz Presburger',
                            email: 'presburger@currycurrylady.com',
                            tickets: 6,
                            signupDate: 201504151230
                        },
                        {
                            id: 73,
                            name: 'Haskell Curry',
                            email: 'haskell@currycurrylady.com',
                            tickets: 5,
                            signupDate: 201604151230
                        },
                        {
                            id: 71,
                            name: 'Alan Turing',
                            email: 'turing@currycurrylady.com',
                            tickets: 1,
                            signupDate: 201604011230
                        },
                        {
                            id: 67,
                            name: 'David Hilbert',
                            email: 'hilbert@currycurrylady.com',
                            tickets: 2,
                            signupDate: 201602081230
                        },
                        {
                            id: 61,
                            name: 'Kurt Gödel',
                            email: 'kurt@currycurrylady.com',
                            tickets: 10,
                            signupDate: 201601101233
                        },
                        {
                            id: 59,
                            name: 'Mojzesz Presburger',
                            email: 'presburger@currycurrylady.com',
                            tickets: 6,
                            signupDate: 201504151236
                        }
                    ]
                }
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
                    sendEmailOnNewTicket: true,
                    customfields: [],
                    tickets: [
                        {
                            ticketNumber: '445441',
                            title: 'Problem with installation',
                            content: 'In varius, tellus ut luctus vestibulum, orci erat commodo ligula, sit amet bibendum arcu libero sed magna. Suspendisse in ligula vitae ante placerat varius id in eros. Etiam commodo viverra nisi in ornare. Donec ullamcorper felis sapien, eu laoreet dolor tincidunt nec. Aliquam erat volutpat. Proin semper viverra purus eget facilisis. Proin fermentum et odio in elementum. Maecenas lacinia, massa consectetur gravida lacinia, nisl lectus tincidunt diam, ut viverra ipsum ex sit amet diam. Mauris ac massa turpis. Fusce ultrices venenatis vestibulum. In et nulla purus. Nullam porta vestibulum leo in dignissim. Duis id ullamcorper odio. Ut purus nulla, consequat lobortis volutpat quis, consequat et libero. Maecenas sit amet libero laoreet, dictum sapien at, hendrerit sapien.',
                            department: {
                                id: 2,
                                name: 'Technical Issues'
                            },
                            date: '201604161427',
                            file: 'some_file.txt',
                            language: 'en',
                            unread: true,
                            closed: false,
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
                                    date: '201504090729',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'COMMENT',
                                    date: '201504090731',
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
                                    date: '201504100732',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'DEPARTMENT_CHANGED',
                                    date: '201504110735',
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
                                    date: '201504120749',
                                    content: 'I have already installed apache, but the problem persists',
                                    author: {
                                        name: 'Haskell Curry',
                                        steve: 'haskell@lambda.com',
                                        staff: false
                                    }
                                },
                                {
                                    type: 'COMMENT',
                                    date: '201505110759',
                                    content: 'Thanks!, I solved it by myself',
                                    author: {
                                        name: 'Haskell Curry',
                                        steve: 'haskell@lambda.com',
                                        staff: false
                                    }
                                },
                                {
                                    type: 'CLOSE',
                                    date: '201505130800',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'RE_OPEN',
                                    date: '201510180807',
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
                            date: '201604150849',
                            file: 'some_file.txt',
                            language: 'en',
                            unread: false,
                            closed: false,
                            author: {
                                name: 'Haskell Curry',
                                email: 'haskell@lambda.com'
                            },
                            owner: null,
                            events: [
                                {
                                    type: 'ASSIGN',
                                    date: '201504090855',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'UN_ASSIGN',
                                    date: '201504100924',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'DEPARTMENT_CHANGED',
                                    date: '201504110932',
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
                                    date: '201504120941',
                                    content: 'I have already installed apache, but the problem persists',
                                    author: {
                                        name: 'Haskell Curry',
                                        steve: 'haskell@lambda.com',
                                        staff: false
                                    }
                                },
                                {
                                    type: 'COMMENT',
                                    date: '201505110955',
                                    content: 'Thanks!, I soved it by myself',
                                    author: {
                                        name: 'Haskell Curry',
                                        steve: 'haskell@lambda.com',
                                        staff: false
                                    }
                                },
                                {
                                    type: 'CLOSE',
                                    date: '201505131030',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'RE_OPEN',
                                    date: '201510181031',
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
                            date: '201504091032',
                            file: 'some_file.txt',
                            language: 'en',
                            unread: false,
                            closed: false,
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
                                    date: '201504091033',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'COMMENT',
                                    date: '201504091055',
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
                                    date: '201504101059',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'DEPARTMENT_CHANGED',
                                    date: '201504111115',
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
                                    date: '201504121117',
                                    content: 'I have already installed apache, but the problem persists',
                                    author: {
                                        name: 'Haskell Curry',
                                        steve: 'haskell@lambda.com',
                                        staff: false
                                    }
                                },
                                {
                                    type: 'COMMENT',
                                    date: '201505111121',
                                    content: 'Thanks!, I soved it by myself',
                                    author: {
                                        name: 'Haskell Curry',
                                        steve: 'haskell@lambda.com',
                                        staff: false
                                    }
                                },
                                {
                                    type: 'CLOSE',
                                    date: '201505131231',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'RE_OPEN',
                                    date: '201510181244',
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
    },
    {
        path: '/user/un-ban',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/user/ban',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/user/list-ban',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: [
                    'unairable@randomword.com',
                    'hotchpot@randomword.com',
                    'elucidator@randomword.com',
                    'sug@randomword.com',
                    'nonculpability@randomword.com',
                    'steeplechaser@randomword.com',
                    'undefinite@randomword.com',
                    'anthobian@randomword.com',
                    'nontourist@randomword.com',
                    'berberis@randomword.com',
                    'sextus@randomword.com',
                    'empiristic@randomword.com',
                    'epistolized@randomword.com',
                    'duntroon@randomword.com',
                    'unpalled@randomword.com',
                    'baddish@randomword.com',
                    'subcritical@randomword.com',
                    'bolger@randomword.com',
                    'deactivate@randomword.com',
                    'visually@randomword.com',
                    'cameral@randomword.com',
                    'unpieced@randomword.com',
                    'gaging@randomword.com',
                    'advancement@randomword.com',
                    'plenteous@randomword.com',
                    'thallious@randomword.com',
                    'vernalizing@randomword.com',
                    'nekhbetv@randomword.com',
                    'unsmocke@randomword.com',
                    'nonprojective@randomword.com',
                    'nonconductible@randomword.com',
                    'gladsomeness@randomword.com',
                    'nongravitation@randomword.com',
                    'restatement@randomword.com',
                    'pokeys@randomword.com',
                    'epis@randomword.com',
                    'successor@randomword.com',
                    'jurisprudentially@randomword.com',
                    'medullization@randomword.com',
                    'evan@randomword.com',
                    'outliver@randomword.com',
                    'antipode@randomword.com',
                    'sunshiny@randomword.com',
                    'microscopopy@randomword.com',
                    'enatic@randomword.com',
                    'smittle@randomword.com',
                    'musk@randomword.com',
                    'litui@randomword.com',
                    'aquarellist@randomword.com',
                    'chirac@randomword.com'
                ]
            };
        }
    }
];
