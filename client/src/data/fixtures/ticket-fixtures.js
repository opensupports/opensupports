module.exports = [
    {
        path: '/ticket/create',
        time: 2000,
        response: function (data) {
            let response;

            if (data.title !== 'error') {
                response = {
                    status: 'success',
                    data: {
                        'ticketNumber': 121444
                    }
                };
            } else {
                response = {
                    status: 'fail',
                    message: 'Ticket could not be created'
                };
            }

            return response;
        }
    },
    {
        path: '/ticket/comment',
        time: 1000,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/ticket/get-custom-responses',
        time: 1000,
        response: function () {
            return {
                status: 'success',
                data: [
                    {name: 'Common issue #1', language: 'en', content: 'some content 1'},
                    {name: 'Common issue #2', language: 'en', content: 'some content 2'},
                    {name: 'Common issue #3', language: 'en', content: 'some content 3'},
                    {name: 'Häufiges Problem #1', language: 'de', content: 'einige Inhalte 1'},
                    {name: 'Häufiges Problem #2', language: 'de', content: 'einige Inhalte 2'}
                ]
            };
        }
    },
    {
        path: '/ticket/add-custom-response',
        time: 1000,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/ticket/edit-custom-response',
        time: 1000,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/ticket/delete-custom-response',
        time: 1000,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/ticket/get',
        time: 1000,
        response: function () {
            return {
                status: 'success',
                data: {
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
                                profilePic: 'http://i65.tinypic.com/9bep95.jpg',
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
                                profilePic: 'http://i65.tinypic.com/9bep95.jpg',
                                staff: true
                            }
                        },
                        {
                            type: 'UN_ASSIGN',
                            date: '20150410',
                            author: {
                                name: 'Emilia Clarke',
                                email: 'jobs@steve.com',
                                profilePic: 'http://i65.tinypic.com/9bep95.jpg',
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
                                profilePic: 'http://i65.tinypic.com/9bep95.jpg',
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
                                profilePic: 'http://i65.tinypic.com/9bep95.jpg',
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
                                profilePic: 'http://i65.tinypic.com/9bep95.jpg',
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
            };
        }
    }
];