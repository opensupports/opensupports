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
