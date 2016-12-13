import _ from 'lodash';

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
                    profilePic: 'http://www.opensupports.com/profilepic.jpg',
                    level: 3,
                    staff: true,
                    departments: [
                        {id: 1, name: 'Sales Support'},
                        {id: 2, name: 'Technical Issues'}
                    ],
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
                                id: 2,
                                name: 'Technical Issues'
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
                                id: 2,
                                name: 'Technical Issues'
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
                        },
                        {
                            ticketNumber: '445441',
                            title: 'Inscription ACM ICPC',
                            content: 'I had a problem with the installation of the php server',
                            department: {
                                id: 1,
                                name: 'Sales Support'
                            },
                            date: '20160416',
                            file: 'http://www.opensupports.com/some_file.zip',
                            language: 'en',
                            unread: false,
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
                            id: 2,
                            name: 'Technical Issues'
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
                            id: 2,
                            name: 'Technical Issues'
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
                    },
                    {
                        ticketNumber: '445441',
                        title: 'Inscription ACM ICPC',
                        content: 'I had a problem with the installation of the php server',
                        department: {
                            id: 1,
                            name: 'Sales Support'
                        },
                        date: '20160416',
                        file: 'http://www.opensupports.com/some_file.zip',
                        language: 'en',
                        unread: false,
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
                            name: 'Sales Support'
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
                        events: []
                    },
                    {
                        ticketNumber: '445441',
                        title: 'Inscription ACM ICPC',
                        content: 'I had a problem with the installation of the php server',
                        department: {
                            id: 1,
                            name: 'Sales Support'
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
                        events: []
                    },
                    {
                        ticketNumber: '445441',
                        title: 'Code jam is awesome',
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
                                name: 'Sales Support'
                            },
                            date: '20160416',
                            file: 'http://www.opensupports.com/some_file.zip',
                            language: 'en',
                            unread: false,
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
                            date: '20160416',
                            file: 'http://www.opensupports.com/some_file.zip',
                            language: 'en',
                            unread: false,
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
                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                        name: 'Emilia Clarke',
                        departments: [{id: 2, name: 'Technical issues'}],
                        assignedTickets: 4,
                        closedTickets: 21,
                        lastLogin: 20161212
                    },
                    {
                        id: 22,
                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                        name: 'Yulian A GUI Yermo',
                        departments: [{id: 2, name: 'Technical issues'}, {id: 1, name: 'Sales Support'}],
                        assignedTickets: 9,
                        closedTickets: 0,
                        lastLogin: 20161212
                    },
                    {
                        id: 22,
                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                        name: 'Miltona Costa',
                        departments: [{id: 1, name: 'Sales Support'}],
                        assignedTickets: -1,
                        closedTickets: -1,
                        lastLogin: 20160212
                    },
                    {
                        id: 22,
                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                        name: 'Emiliasnikova Rusachestkvuy',
                        departments: [{id: 1, name: 'Sales Support'}, {id: 3, name: 'System and Administration'}],
                        assignedTickets: 100,
                        closedTickets: 21,
                        lastLogin: 20130101
                    },
                    {
                        id: 22,
                        profilePic: 'http://www.opensupports.com/profilepic.jpg',
                        name: 'Laurita Morrechaga Rusachestkvuy',
                        departments: [{id: 3, name: 'System and Administration'}],
                        assignedTickets: 1,
                        closedTickets: 1,
                        lastLogin: 2012050
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
    }
];