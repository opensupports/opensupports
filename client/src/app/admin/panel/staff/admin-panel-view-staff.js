import React from 'react';
import _ from 'lodash';

import StaffEditor from 'app/admin/panel/staff/staff-editor';

class AdminPanelViewStaff extends React.Component {

    render() {
        return (
            <div>
                <StaffEditor {...this.getEditorProps()}/>
            </div>
        );
    }

    getEditorProps() {
        return {
            name: 'Emilia Clarke',
            email: 'jobs@steve.com',
            profilePic: 'http://www.opensupports.com/profilepic.jpg',
            level: 3,
            departments: [
                {id: 1, name: 'Sales Support'},
                {id: 2, name: 'Technical Issues'}
            ],
            tickets : _.times(13).map(() => {
                return {
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
                    priority: 'low',
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
                };
            })
        };
    }

}

export default AdminPanelViewStaff;