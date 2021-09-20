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
                        'title': 'Support Center',
                        'layout': 'boxed',
                        'server-email': 'shitr@post.com',
                        'smtp-host': 'localhost',
                        'smtp-port': '7070',
                        'smtp-user': 'Wesa',
                        'session-prefix': 'opensupports-z6ctpq2winvfhchX2_',
                        'maintenance-mode': false,
                        'allow-attachments': true,
                        'max-size': 1,
                        'departments': [
                            {id: 1, name: 'Sales Support', owners: 2},
                            {id: 2, name: 'Technical Issues', owners: 5},
                            {id: 3, name: 'System and Administration', owners: 0}
                        ],
                        'allowedLanguages': ['en', 'es', 'de', 'fr', 'pt', 'jp', 'ru', 'cn', 'in', 'tr'],
                        'supportedLanguages': ['en', 'es', 'de'],
                        'registration': true,
                        'mandatory-login': true,
                        'tags': [{id:1,name:'bug', color:'#eb144c'},{id: 2,name:'suggestion',color:'#ff6900'}]
                    }
                };

            } else {
                return {
                    status: 'success',
                    data: {
                        'language': 'en',
                        'title': 'Support Center',
                        'layout': 'boxed',
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
                        'mandatory-login': true,
                        'tags': [{id:1,name:'bug', color:'#eb144c'},{id: 2,name:'suggestion',color:'#ff6900'}]
                    }
                };
            }
        }
    },
    {
        path: '/system/init-settings',
        time: 50,
        response: function() {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/system/init-database',
        time: 50,
        response: function() {
            return {
                status: 'success',
                message: 'ERROR_SERVER',
                data: {}
            };
        }
    },
    {
        path: '/system/init-admin',
        time: 50,
        response: function() {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/system/edit-settings',
        time: 50,
        response: function() {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/system/check-requirements',
        time: 50,
        response: function () {
            return {
                status: 'success',
                data: {
                    phpVersion: {
                        name: 'PHP Version',
                        value: 5.6,
                        ok: true
                    },
                    PDO: {
                        name: 'PDO Module',
                        value: 'Available',
                        ok: true
                    },
                    files: {
                        name: 'Folder: /api/files',
                        value: 'Writable',
                        ok: true
                    },
                    configFile: {
                        name: 'File: /api/config.php',
                        value: 'Writable',
                        ok: true
                    }
                }
            };
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
        path: '/system/test-smtp',
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
    },
    {
        path: '/system/get-custom-fields',
        time: 100,
        data: []
    }
];
