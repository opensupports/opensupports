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
                    {id: 1, name: 'Common issue #1', language: 'en', content: 'some content 1'},
                    {id: 2, name: 'Common issue #2', language: 'en', content: 'some <strong>content</strong> 2'},
                    {id: 3, name: 'Common issue #3', language: 'en', content: 'some content 3'},
                    {id: 4, name: 'H�ufiges Problem #1', language: 'de', content: 'einige Inhalte 1'},
                    {id: 5, name: 'H�ufiges Problem #2', language: 'de', content: 'einige Inhalte 2'}
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
        path: '/ticket/seen',
        time: 200,
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
                        id: '1',
                        name: 'Sales Support'
                    },
                    date: '201604151155',
                    file: 'http://www.opensupports.com/some_file.zip',
                    language: 'en',
                    unread: false,
                    unreadStaff: true,
                    closed: false,
                    tags: [],
                    author: {
                        id: '3',
                        name: 'Haskell Curry',
                        email: 'haskell@lambda.com'
                    },
                    owner: {
                        id: '12',
                        name: 'Steve Jobs'
                    },
                    events: [
                        {
                            type: 'ASSIGN',
                            date: '201504090650',
                            author: {
                                name: 'Emilia Clarke',
                                email: 'jobs@steve.com',
                                profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                staff: true
                            }
                        },
                        {
                            type: 'COMMENT',
                            date: '201504090729',
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
                            date: '201504100922',
                            author: {
                                name: 'Emilia Clarke',
                                email: 'jobs@steve.com',
                                profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                staff: true
                            }
                        },
                        {
                            type: 'DEPARTMENT_CHANGED',
                            date: '201504111000',
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
                            date: '201504121001',
                            content: 'I have already installed apache, but the problem persists',
                            author: {
                                name: 'Haskell Curry',
                                steve: 'haskell@lambda.com',
                                staff: false
                            }
                        },
                        {
                            type: 'COMMENT',
                            date: '201505111003',
                            content: 'Thanks!, I soved it by myself',
                            author: {
                                name: 'Haskell Curry',
                                steve: 'haskell@lambda.com',
                                staff: false
                            }
                        },
                        {
                            type: 'CLOSE',
                            date: '201505131004',
                            author: {
                                name: 'Emilia Clarke',
                                email: 'jobs@steve.com',
                                profilePic: 'http://www.opensupports.com/profilepic.jpg',
                                staff: true
                            }
                        },
                        {
                            type: 'RE_OPEN',
                            date: '201510181005',
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
