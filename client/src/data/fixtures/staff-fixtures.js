const _ = require('lodash');

module.exports = [
    {
        path: '/staff/get',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {
                    name: 'Emilia Clarke',
                    email: 'staff@opensupports.com',
                    profilePic: '',
                    sendEmailOnNewTicket: true,
                    level: 3,
                    staff: true,
                    departments: [
                        {id: 1, name: 'Sales Support', owners: 2},
                        {id: 2, name: 'Technical Issues', owners: 5}
                    ],
                    tickets: [
                        {
                            ticketNumber: '445441',
                            title: 'Problem with installation',
                            content: 'I had a problem with the installation of the php server',
                            department: {
                                id: 2,
                                name: 'Technical Issues',
                                owners: 5
                            },
                            date: '20160416',
                            file: 'http://www.opensupports.com/some_file.zip',
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
                                    date: '20150409',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: '',
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
                                        profilePic: '',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'UN_ASSIGN',
                                    date: '20150410',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: '',
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
                                        profilePic: '',
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
                                        profilePic: '',
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
                                id: 2,
                                name: 'Technical Issues',
                                owners: 5
                            },
                            date: '20160415',
                            file: 'http://www.opensupports.com/some_file.zip',
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
                                    date: '20150409',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: '',
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
                                        profilePic: '',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'UN_ASSIGN',
                                    date: '20150410',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: '',
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
                                        profilePic: '',
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
                                        profilePic: '',
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
                                id: 2,
                                name: 'Technical Issues',
                                owners: 5
                            },
                            date: '20150409',
                            file: 'http://www.opensupports.com/some_file.zip',
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
                                    date: '20150409',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: '',
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
                                        profilePic: '',
                                        staff: true
                                    }
                                },
                                {
                                    type: 'UN_ASSIGN',
                                    date: '20150410',
                                    author: {
                                        name: 'Emilia Clarke',
                                        email: 'jobs@steve.com',
                                        profilePic: '',
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
                                        profilePic: '',
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
                                        profilePic: '',
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
                            ticketNumber: '445441',
                            title: 'Inscription ACM ICPC',
                            content: 'I had a problem with the installation of the php server',
                            department: {
                                id: 1,
                                name: 'Sales Support',
                                owners: 2
                            },
                            date: '20160416',
                            file: 'http://www.opensupports.com/some_file.zip',
                            language: 'en',
                            unread: false,
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
                            events: []
                        }
                    ]
                }
            };
        }
    },
    {
        path: '/staff/get-tickets',
        time: 300,
        response: function () {
            return {
                status: 'success',
                data: [
                    {
                        ticketNumber: '445441',
                        title: 'Problem with installation',
                        content: 'I had a problem with the installation of the php server',
                        department: {
                            id: 2,
                            name: 'Technical Issues',
                            owners: 5
                        },
                        date: '201604161230',
                        file: 'http://www.opensupports.com/some_file.zip',
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
                                date: '201504091149',
                                author: {
                                    name: 'Emilia Clarke',
                                    email: 'jobs@steve.com',
                                    profilePic: '',
                                    staff: true
                                }
                            },
                            {
                                type: 'COMMENT',
                                date: '201504091238',
                                content: 'Do you have apache installed? It generally happens if you dont have apache.',
                                author: {
                                    name: 'Emilia Clarke',
                                    email: 'jobs@steve.com',
                                    profilePic: '',
                                    staff: true
                                }
                            },
                            {
                                type: 'UN_ASSIGN',
                                date: '201504102349',
                                author: {
                                    name: 'Emilia Clarke',
                                    email: 'jobs@steve.com',
                                    profilePic: '',
                                    staff: true
                                }
                            },
                            {
                                type: 'DEPARTMENT_CHANGED',
                                date: '201504110021',
                                content: 'System support',
                                author: {
                                    name: 'Emilia Clarke',
                                    email: 'jobs@steve.com',
                                    profilePic: '',
                                    staff: true
                                }
                            },
                            {
                                type: 'COMMENT',
                                date: '201504120123',
                                content: 'I have already installed apache, but the problem persists',
                                author: {
                                    name: 'Haskell Curry',
                                    steve: 'haskell@lambda.com',
                                    staff: false
                                }
                            },
                            {
                                type: 'COMMENT',
                                date: '201505110405',
                                content: 'Thanks!, I solved it by myself',
                                author: {
                                    name: 'Haskell Curry',
                                    steve: 'haskell@lambda.com',
                                    staff: false
                                }
                            },
                            {
                                type: 'CLOSE',
                                date: '201505130429',
                                author: {
                                    name: 'Emilia Clarke',
                                    email: 'jobs@steve.com',
                                    profilePic: '',
                                    staff: true
                                }
                            },
                            {
                                type: 'RE_OPEN',
                                date: '201510180430',
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
                            id: 2,
                            name: 'Technical Issues',
                            owners: 5
                        },
                        date: '201604150550',
                        file: 'http://www.opensupports.com/some_file.zip',
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
                                date: '201504091010',
                                author: {
                                    name: 'Emilia Clarke',
                                    email: 'jobs@steve.com',
                                    profilePic: '',
                                    staff: true
                                }
                            },
                            {
                                type: 'COMMENT',
                                date: '201504091012',
                                content: 'Do you have apache installed? It generally happens if you dont have apache.',
                                author: {
                                    name: 'Emilia Clarke',
                                    email: 'jobs@steve.com',
                                    profilePic: '',
                                    staff: true
                                }
                            },
                            {
                                type: 'UN_ASSIGN',
                                date: '201504101245',
                                author: {
                                    name: 'Emilia Clarke',
                                    email: 'jobs@steve.com',
                                    profilePic: '',
                                    staff: true
                                }
                            },
                            {
                                type: 'DEPARTMENT_CHANGED',
                                date: '201504112359',
                                content: 'System support',
                                author: {
                                    name: 'Emilia Clarke',
                                    email: 'jobs@steve.com',
                                    profilePic: '',
                                    staff: true
                                }
                            },
                            {
                                type: 'COMMENT',
                                date: '201504122359',
                                content: 'I have already installed apache, but the problem persists',
                                author: {
                                    name: 'Haskell Curry',
                                    steve: 'haskell@lambda.com',
                                    staff: false
                                }
                            },
                            {
                                type: 'COMMENT',
                                date: '201505112241',
                                content: 'Thanks!, I soved it by myself',
                                author: {
                                    name: 'Haskell Curry',
                                    steve: 'haskell@lambda.com',
                                    staff: false
                                }
                            },
                            {
                                type: 'CLOSE',
                                date: '201505132243',
                                author: {
                                    name: 'Emilia Clarke',
                                    email: 'jobs@steve.com',
                                    profilePic: '',
                                    staff: true
                                }
                            },
                            {
                                type: 'RE_OPEN',
                                date: '201510182250',
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
                            id: 2,
                            name: 'Technical Issues',
                            owners: 5
                        },
                        date: '201504092255',
                        file: 'http://www.opensupports.com/some_file.zip',
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
                                date: '201504092300',
                                author: {
                                    name: 'Emilia Clarke',
                                    email: 'jobs@steve.com',
                                    profilePic: '',
                                    staff: true
                                }
                            },
                            {
                                type: 'COMMENT',
                                date: '201504092301',
                                content: 'Do you have apache installed? It generally happens if you dont have apache.',
                                author: {
                                    name: 'Emilia Clarke',
                                    email: 'jobs@steve.com',
                                    profilePic: '',
                                    staff: true
                                }
                            },
                            {
                                type: 'UN_ASSIGN',
                                date: '201504102302',
                                author: {
                                    name: 'Emilia Clarke',
                                    email: 'jobs@steve.com',
                                    profilePic: '',
                                    staff: true
                                }
                            },
                            {
                                type: 'DEPARTMENT_CHANGED',
                                date: '201504112303',
                                content: 'System support',
                                author: {
                                    name: 'Emilia Clarke',
                                    email: 'jobs@steve.com',
                                    profilePic: '',
                                    staff: true
                                }
                            },
                            {
                                type: 'COMMENT',
                                date: '201504122304',
                                content: 'I have already installed apache, but the problem persists',
                                author: {
                                    name: 'Haskell Curry',
                                    steve: 'haskell@lambda.com',
                                    staff: false
                                }
                            },
                            {
                                type: 'COMMENT',
                                date: '201505112306',
                                content: 'Thanks!, I soved it by myself',
                                author: {
                                    name: 'Haskell Curry',
                                    steve: 'haskell@lambda.com',
                                    staff: false
                                }
                            },
                            {
                                type: 'CLOSE',
                                date: '201505132307',
                                author: {
                                    name: 'Emilia Clarke',
                                    email: 'jobs@steve.com',
                                    profilePic: '',
                                    staff: true
                                }
                            },
                            {
                                type: 'RE_OPEN',
                                date: '201510182309',
                                author: {
                                    name: 'Haskell Curry',
                                    email: 'haskell@lambda.com',
                                    staff: false
                                }
                            }
                        ]
                    },
                    {
                        ticketNumber: '445441',
                        title: 'Inscription ACM ICPC',
                        content: 'I had a problem with the installation of the php server',
                        department: {
                            id: 1,
                            name: 'Sales Support',
                            owners: 2
                        },
                        date: '201604162310',
                        file: 'http://www.opensupports.com/some_file.zip',
                        language: 'en',
                        unread: false,
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
                        events: []
                    }
                ]
            }
        }
    },
    {
        path: '/staff/get-new-tickets',
        time: 300,
        response: function () {
            return {
                status: 'success',
                data: [
                    {
                        ticketNumber: '445441',
                        title: 'Inscription ACM ICPC',
                        content: 'I had a problem with the installation of the php server',
                        department: {
                            id: 1,
                            name: 'Sales Support',
                            owners: 2
                        },
                        date: '201604161040',
                        file: 'http://www.opensupports.com/some_file.zip',
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
                        events: []
                    },
                    {
                        ticketNumber: '445441',
                        title: 'Inscription ACM ICPC',
                        content: 'I had a problem with the installation of the php server',
                        department: {
                            id: 1,
                            name: 'Sales Support',
                            owners: 2
                        },
                        date: '201604161042',
                        file: 'http://www.opensupports.com/some_file.zip',
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
                        events: []
                    },
                    {
                        ticketNumber: '445441',
                        title: 'Code jam is awesome',
                        content: 'I had a problem with the installation of the php server',
                        department: {
                            id: 2,
                            name: 'Technical Issues',
                            owners: 2
                        },
                        date: '201604161055',
                        file: 'http://www.opensupports.com/some_file.zip',
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
                        events: []
                    }
                ]
            }
        }
    },
    {
        path: '/staff/get-all-tickets',
        time: 1000,
        response: function () {
            return {
                status: 'success',
                data: {
                    tickets: _.range(0, 10).map(() => {
                        return {
                            ticketNumber: '445441',
                            title: 'Inscription ACM ICPC',
                            content: 'I had a problem with the installation of the php server',
                            department: {
                                id: 1,
                                name: 'Sales Support',
                                owners: 2
                            },
                            date: '201604161055',
                            file: 'http://www.opensupports.com/some_file.zip',
                            language: 'en',
                            unread: false,
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
                            events: []
                        };
                    }),
                    pages: 4
                }
            }

        }
    },
    {
        path: '/staff/search-tickets',
        time: 300,
        response: function () {
            return {
                status: 'success',
                data: {
                    tickets: _.range(0, 10).map(() => {
                        return {
                            ticketNumber: '445441',
                            title: 'Inscription ACM ICPC',
                            content: 'I had a problem with the installation of the php server',
                            department: {
                                id: 1,
                                name: 'Sales Support'
                            },
                            date: '201604161100',
                            file: 'http://www.opensupports.com/some_file.zip',
                            language: 'en',
                            unread: false,
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
                            events: []
                        };
                    }),
                    pages: 2
                }
            }
        }
    },
    {
        path: '/staff/get-all',
        time: 100,
        response: function() {
            return {
                status: 'success',
                data: [
                    {
                        id: 22,
                        profilePic: '',
                        name: 'Emilia Clarke',
                        departments: [{id: 2, name: 'Technical issues'}],
                        assignedTickets: 4,
                        closedTickets: 21,
                        lastLogin: 201612121150
                    },
                    {
                        id: 22,
                        profilePic: '',
                        name: 'Yulian A GUI Yermo',
                        departments: [{id: 2, name: 'Technical issues'}, {id: 1, name: 'Sales Support'}],
                        assignedTickets: 9,
                        closedTickets: 0,
                        lastLogin: 201612121155
                    },
                    {
                        id: 22,
                        profilePic: '',
                        name: 'Miltona Costa',
                        departments: [{id: 1, name: 'Sales Support'}],
                        assignedTickets: -1,
                        closedTickets: -1,
                        lastLogin: 201602121158
                    },
                    {
                        id: 22,
                        profilePic: '',
                        name: 'Emiliasnikova Rusachestkvuy',
                        departments: [{id: 1, name: 'Sales Support'}, {id: 3, name: 'System and Administration'}],
                        assignedTickets: 100,
                        closedTickets: 21,
                        lastLogin: 201301012346
                    },
                    {
                        id: 22,
                        profilePic: '',
                        name: 'Laurita Morrechaga Rusachestkvuy',
                        departments: [{id: 3, name: 'System and Administration'}],
                        assignedTickets: 1,
                        closedTickets: 1,
                        lastLogin: null
                    }
                ]
            };
        }
    },
    {
        path: '/staff/add',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {
                    staffId: 5
                }
            };
        }
    },
    {
        path: '/staff/edit',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/staff/delete',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/staff/last-events',
        time: 300,
        response: function(data) {

            if(data.page > 5) {
                return {
                    status: 'success',
                    data: []
                };
            }

            return {
                status: 'success',
                data: [
                    {
                        "type": "COMMENT",
                        "ticketNumber": "683061",
                        "author": {
                            "name": "Tyrion Lannister",
                            "staff": false,
                            "id": "10"
                        }
                    },
                    {
                        "type": "RE_OPEN",
                        "ticketNumber": "683061",
                        "author": {
                            "name": "Tyrion Lannister",
                            "staff": false,
                            "id": "10"
                        }
                    },
                    {
                        "type": "CLOSE",
                        "ticketNumber": "683061",
                        "author": {
                            "name": "Emilia Clarke",
                            "staff": true,
                            "id": "1"
                        }
                    },
                    {
                        "type": "DEPARTMENT_CHANGED",
                        "ticketNumber": "683061",
                        "author": {
                            "name": "Emilia Clarke",
                            "staff": true,
                            "id": "1"
                        }
                    },
                    {
                        "type": "ASSIGN",
                        "ticketNumber": "683061",
                        "author": {
                            "name": "Emilia Clarke",
                            "staff": true,
                            "id": "1"
                        }
                    },
                    {
                        "type": "UN_ASSIGN",
                        "ticketNumber": "683061",
                        "author": {
                            "name": "Emilia Clarke",
                            "staff": true,
                            "id": "1"
                        }
                    },
                    {
                        "type": "COMMENT",
                        "ticketNumber": "683061",
                        "author": {
                            "name": "Emilia Clarke",
                            "staff": true,
                            "id": "1"
                        }
                    },
                    {
                        "type": "ASSIGN",
                        "ticketNumber": "683061",
                        "author": {
                            "name": "Emilia Clarke",
                            "staff": true,
                            "id": "1"
                        }
                    },
                ]
            };
        }
    }
];
