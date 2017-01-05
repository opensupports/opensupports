module.exports = [
    {
        path: '/system/get-settings',
        time: 1000,
        response: function (params) {
            if(params && params.allSettings) {
                return {
                    status: 'success',
                    data: {
                        'language': 'en',
                        'reCaptchaKey': '6LfM5CYTAAAAAGLz6ctpf-hchX2_l0Ge-Bn-n8wS',
                        'reCaptchaPrivate': 'LALA',
                        'url': 'hola@lala.com',
                        'title': 'Very Cool',
                        'layout': 'Boxed',
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
                        'supportedLanguages': ['en', 'es', 'de']
                    }
                };

            } else {
                return {
                    status: 'success',
                    data: {
                        'language': 'en',
                        'reCaptchaKey': '6LfM5CYTAAAAAGLz6ctpf-hchX2_l0Ge-Bn-n8wS',
                        'maintenance-mode': false,
                        'departments': [
                            {id: 1, name: 'Sales Support', owners: 2},
                            {id: 2, name: 'Technical Issues', owners: 5},
                            {id: 3, name: 'System and Administration', owners: 0}
                        ],
                        'allowedLanguages': ['en', 'es', 'de', 'fr', 'pt', 'jp', 'ru', 'cn', 'in', 'tr'],
                        'supportedLanguages': ['en', 'es', 'de']
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
        path: '/system/get-logs',
        time: 30,
        response: function() {
            return {
                "status": "success",
                "data": [
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
