module.exports = [
    {
        path: '/system/get-configs',
        time: 1000,
        response: function () {
            return {
                status: 'success',
                data: {
                    'language': 'us',
                    'reCaptchaKey': '6LfM5CYTAAAAAGLz6ctpf-hchX2_l0Ge-Bn-n8wS'
                }
            };
        }
    }
];
