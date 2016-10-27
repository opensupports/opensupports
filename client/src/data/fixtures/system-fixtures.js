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
                    'departments': [
                        {id: 1, name: 'Sales Support'},
                        {id: 2, name: 'Technical Issues'},
                        {id: 3, name: 'System and Administration'}
                    ]
                }
            };
        }
    }
];
