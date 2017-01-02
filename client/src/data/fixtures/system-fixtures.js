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
                    ]
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
                        type: 'USER_SIGNUP',
                        'en': {
                            'subject': 'Signup {{to}} - OpenSupports',
                            'body' : 'This is the user signup content {{name}}'
                        },
                        'es': {
                            'subject' : 'Registrado {{to}} - OpenSupports',
                            'body' : 'Este es el contenido de signup {{name}}'
                        },
                        'de': {
                            'subject' : 'Anmelden {{to}} - OpenSupports',
                            'body' : 'Dies ist der User Signup Content {{name}}'
                        }
                    },
                    {
                        type: 'USER_EDIT_PASSWORD',
                        'en': {
                            'subject': 'Password changed {{to}} - OpenSupports',
                            'body' : 'Password has been edited {{name}}'
                        },
                        'es': {
                            'subject' : 'Password cambiado {{to}} - OpenSupports',
                            'body' : 'El password ha sido editado {{name}}'
                        },
                        'de': {
                            'subject' : 'Passwort geändert {{to}} - OpenSupports',
                            'body' : 'Passwort wurde bearbeitet {{name}}'
                        }
                    }
                ]
            };
        }
    }
];
