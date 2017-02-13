module.exports = [
    {
        path: '/system/get-settings',
        time: 850,
        response: function (params) {
            if(params && params.allSettings) {
                return {
                    status: 'success',
                    data: {
                        'language': 'en',
                        'reCaptchaKey': '6LfM5CYTAAAAAGLz6ctpf-hchX2_l0Ge-Bn-n8wS',
                        'reCaptchaPrivate': 'LALA',
                        'url': 'http://www.opensupports.com/support',
                        'title': 'OpenSupports Support Center',
                        'layout': 'full-width',
                        'time-zone': 3,
                        'no-reply-email': 'shitr@post.com',
                        'smtp-host': 'localhost',
                        'smtp-port': '7070',
                        'smtp-user': 'Wesa',
                        'maintenance-mode': false,
                        'allow-attachments': true,
                        'max-size': 500,
                        'departments': [
                            {id: 1, name: 'Sales Support', owners: 2},
                            {id: 2, name: 'Technical Issues', owners: 5},
                            {id: 3, name: 'System and Administration', owners: 0}
                        ],
                        'allowedLanguages': ['en', 'es', 'de', 'fr', 'pt', 'jp', 'ru', 'cn', 'in', 'tr'],
                        'supportedLanguages': ['en', 'es', 'de'],
                        'registration': true,
                        'user-system-enabled': true
                    }
                };

            } else {
                return {
                    status: 'success',
                    data: {
                        'language': 'en',
                        'title': '',
                        'layout': 'full-width',
                        'reCaptchaKey': '6LfM5CYTAAAAAGLz6ctpf-hchX2_l0Ge-Bn-n8wS',
                        'maintenance-mode': false,
                        'departments': [
                            {id: 1, name: 'Sales Support', owners: 2},
                            {id: 2, name: 'Technical Issues', owners: 5},
                            {id: 3, name: 'System and Administration', owners: 0}
                        ],
                        'allowedLanguages': ['en', 'es', 'de', 'fr', 'pt', 'jp', 'ru', 'cn', 'in', 'tr'],
                        'supportedLanguages': ['en', 'es', 'de'],
                        'registration': true,
                        'user-system-enabled': true
                    }
                };
            }
        }
    },
    {
        path: '/system/edit-settings',
        time: 50,
        response: function() {
            return {
                status: 'success',
                data: {}
            }
        }
    },
    {
        path: '/system/add-department',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/system/edit-department',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/system/delete-department',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/system/edit-mail-template',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/system/recover-mail-template',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/system/download',
        time: 100,
        contentType: 'application/octet-stream',
        response: function () {
            return 'text content';
        }
    },
    {
        path: '/system/delete-all-users',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/system/backup-database',
        time: 100,
        contentType: 'application/octet-stream',
        response: function () {
            return 'text content';
        }
    },
    {
        path: '/system/import-csv',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/system/import-sql',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/system/get-mail-templates',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: [
                    {
                        type: 'USER_SINGUP',
                        language: 'en',
                        subject: 'Signup {{to}} - OpenSupports',
                        body : 'This is the user signup content {{name}}'
                    },
                    {
                        type: 'USER_SINGUP',
                        language: 'es',
                        subject: 'Registrado {{to}} - OpenSupports',
                        body : 'Este es el contenido de signup {{name}}'
                    },
                    {
                        type: 'USER_SINGUP',
                        language: 'de',
                        subject: 'Anmelden {{to}} - OpenSupports',
                        body : 'Dies ist der User Signup Content {{name}}'
                    },
                    {
                        type: 'USER_EDIT_PASSWORD',
                        language: 'en',
                        subject: 'Password changed {{to}} - OpenSupports',
                        body : 'Password has been edited {{name}}'
                    },
                    {
                        type: 'USER_EDIT_PASSWORD',
                        language: 'es',
                        subject: 'Password cambiado {{to}} - OpenSupports',
                        body : 'El password ha sido editado {{name}}'
                    },
                    {
                        type: 'USER_EDIT_PASSWORD',
                        language: 'de',
                        subject: 'Passwort geändert {{to}} - OpenSupports',
                        body : 'Passwort wurde bearbeitet {{name}}'
                    }
                ]
            };
        }
    },
    {
        path: '/system/get-stats',
        time: 200,
        response: function(_data) {
            let generalVal = _data.staffId;

            let ID = {
                'WEEK': 7,
                'MONTH': 30,
                'QUARTER': 90,
                'YEAR': 365
            };

            let k = ID[_data.period];
            let DATA = [];

            for (let i = 0; i < k; i++) {
                if(generalVal){
                    DATA.push({
                        date: '201701' + (i + 103) % 100,
                        type: 'ASSIGN',
                        general: generalVal,
                        value: (Math.floor((Math.random() + 17) * i)).toString()
                    });
                    DATA.push({
                        date: '201701' + (i + 109) % 100,
                        type: 'CLOSE',
                        general: generalVal,
                        value: (Math.floor((Math.random() + 12) * i )).toString()
                    });
                }
                else {
                    DATA.push({
                        date: '201701' + (i + 107) % 100,
                        type: 'COMMENT',
                        general: generalVal,
                        value: (Math.floor((Math.random() + 5) * i)).toString()
                    });
                    DATA.push({
                        date: '201701' + (i + 104) % 100,
                        type: 'SIGNUP',
                        general: generalVal,
                        value: (Math.floor(Math.random() * (i - 180) * (i - 185) / 400)).toString()
                    });
                    DATA.push({
                        date: '201701' + (i + 103) % 100,
                        type: 'CLOSE',
                        general: generalVal,
                        value: (Math.floor((Math.random() + 12) * i )).toString()
                    });
                    DATA.push({
                        date: '201701' + (i + 99) % 100,
                        type: 'CREATE_TICKET',
                        general: generalVal,
                        value: (Math.floor((Math.random() + 7) * i)).toString()
                    });
                }
            }

            return {
                status: "success",
                data: DATA
            };
        }
    },
    {
        path: '/system/enable-user-system',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            }
        }
    },
    {
        path: '/system/disable-user-system',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            }
        }
    },
    {
        path: '/system/enable-registration',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            }
        }
    },
    {
        path: '/system/disable-registration',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            }
        }
    },
    {
        path: '/system/add-api-key',
        time: 300,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/system/delete-api-key',
        time: 300,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/system/get-api-keys',
        time: 300,
        response: function () {
            return {
                status: 'success',
                data: [
                    {
                        name: 'Game System Registration',
                        token: '9as8da9s51c6a51c51a9s1c9asdf1'
                    },
                    {
                        name: 'PHPbb forum',
                        token: 'apires1qe65fq65e1f6a5e1f6afaef2'
                    },
                    {
                        name: 'How do you turn this on?',
                        token: 'das65d4as651age16wq6ofqwwcemcw'
                    }
                ]
            }
        }
    },
    {
        path: '/system/get-logs',
        time: 300,
        response: function () {
            return {
                status: "success",
                data: [
                    {
                        "type": "EDIT_SETTINGS",
                        "to": null,
                        "author": {
                            "name": "Emilia Clarke",
                            "id": "1",
                            "staff": true
                        }
                    },
                    {
                        "type": "SIGNUP",
                        "to": null,
                        "author": {
                            "name": "Steve Jobs",
                            "id": "1",
                            "staff": false
                        }
                    },
                    {
                        "type": "SIGNUP",
                        "to": null,
                        "author": {
                            "name": "steve jobs",
                            "id": "2",
                            "staff": false
                        }
                    },
                    {
                        "type": "SIGNUP",
                        "to": null,
                        "author": {
                            "name": "steve jobs",
                            "id": "3",
                            "staff": false
                        }
                    },
                    {
                        "type": "SIGNUP",
                        "to": null,
                        "author": {
                            "name": "Creator",
                            "id": "5",
                            "staff": false
                        }
                    },
                    {
                        "type": "CREATE_TICKET",
                        "to": "739228",
                        "author": {
                            "name": "Creator",
                            "id": "5",
                            "staff": false
                        }
                    },
                    {
                        "type": "CREATE_TICKET",
                        "to": "915839",
                        "author": {
                            "name": "Creator",
                            "id": "5",
                            "staff": false
                        }
                    },
                    {
                        "type": "CREATE_TICKET",
                        "to": "192450",
                        "author": {
                            "name": "Creator",
                            "id": "5",
                            "staff": false
                        }
                    },
                    {
                        "type": "CREATE_TICKET",
                        "to": "369061",
                        "author": {
                            "name": "Creator",
                            "id": "5",
                            "staff": false
                        }
                    },
                    {
                        "type": "SIGNUP",
                        "to": null,
                        "author": {
                            "name": "Commenter",
                            "id": "6",
                            "staff": false
                        }
                    }
                ]
            };
        }
    }
];
