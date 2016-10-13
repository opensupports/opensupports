module.exports = [
    {
        path: '/ticket/create',
        time: 2000,
        response: function (data) {
            let response;

            if (data.title !== 'error') {
                response = {
                    status: 'success',
                    data: {
                        'ticketNumber': 121444
                    }
                };
            } else {
                response = {
                    status: 'fail',
                    message: 'Ticket could not be created'
                };
            }

            return response;
        }
    },
    {
        path: '/ticket/comment',
        time: 1000,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/ticket/get-custom-responses',
        time: 1000,
        response: function () {
            return {
                status: 'success',
                data: [
                    {name: 'Common issue #1', language: 'en', content: 'some content'},
                    {name: 'Common issue #2', language: 'en', content: 'some content'},
                    {name: 'Common issue #3', language: 'en', content: 'some content'},
                    {name: 'Häufiges Problem #1', language: 'de', content: 'einige Inhalte'},
                    {name: 'Häufiges Problem #2', language: 'de', content: 'einige Inhalte'}
                ]
            };
        }
    },
    {
        path: '/ticket/add-custom-response',
        time: 1000,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/ticket/edit-custom-response',
        time: 1000,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/ticket/delete-custom-response',
        time: 1000,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    }
];