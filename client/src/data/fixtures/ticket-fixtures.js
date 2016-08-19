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
    }
];