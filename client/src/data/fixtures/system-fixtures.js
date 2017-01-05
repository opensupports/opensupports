module.exports = [
    {
        path: '/system/get-settings',
        time: 1000,
        response: function () {
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
                status: 'success',
                data: [
                    {
                        "type": "COMMENT",
                        "ticketNumber": "683061",
                        "author": {
                            "name": "Julieta Lannister",
                            "staff": false,
                            "id": "10"
                        }
                    },
                    {
                        "type": "RE_OPEN",
                        "ticketNumber": "683061",
                        "author": {
                            "name": "Elizabelth Lannister",
                            "staff": false,
                            "id": "10"
                        }
                    },
                    {
                        "type": "CLOSE",
                        "ticketNumber": "683061",
                        "author": {
                            "name": "Emilia Clarker",
                            "staff": true,
                            "id": "1"
                        }
                    },
                    {
                        "type": "DEPARTMENT_CHANGED",
                        "ticketNumber": "683061",
                        "author": {
                            "name": "Emilia Clarker",
                            "staff": true,
                            "id": "1"
                        }
                    },
                    {
                        "type": "PRIORITY_CHANGED",
                        "ticketNumber": "683061",
                        "author": {
                            "name": "Emilia Clarker",
                            "staff": true,
                            "id": "1"
                        }
                    },
                    {
                        "type": "ASSIGN",
                        "ticketNumber": "683061",
                        "author": {
                            "name": "Emilia Clarker",
                            "staff": true,
                            "id": "1"
                        }
                    },
                    {
                        "type": "UN_ASSIGN",
                        "ticketNumber": "683061",
                        "author": {
                            "name": "Emilia Clarker",
                            "staff": true,
                            "id": "1"
                        }
                    },
                    {
                        "type": "COMMENT",
                        "ticketNumber": "683061",
                        "author": {
                            "name": "Emilia Clarker",
                            "staff": true,
                            "id": "1"
                        }
                    },
                    {
                        "type": "ASSIGN",
                        "ticketNumber": "683061",
                        "author": {
                            "name": "Emilia Clarker",
                            "staff": true,
                            "id": "1"
                        }
                    },
                    {
                        "type": "PRIORITY_CHANGED",
                        "ticketNumber": "608120",
                        "author": {
                            "name": "Emilia Clarker",
                            "staff": true,
                            "id": "1"
                        }
                    }
                ]
            };
        }
    }
];
