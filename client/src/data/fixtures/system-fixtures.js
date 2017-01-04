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
                        'fileAttachments': false,
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
        path: '/staff/add-department',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/staff/edit-department',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/staff/delete-department',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    }
];
