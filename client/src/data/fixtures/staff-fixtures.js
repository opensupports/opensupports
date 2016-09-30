module.exports = [
    {
        path: '/staff/get',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {
                    name: 'Emilia Clarke',
                    email: 'staff@opensupports.com',
                    profilePic: 'http://i65.tinypic.com/9bep95.jpg',
                    level: 1,
                    staff: true,
                    departments: [
                        {id: 1, name: 'Sales Support'},
                        {id: 2, name: 'Technical Issues'},
                        {id: 3, name: 'System and Administration'}
                    ]
                }
            };
        }
    }
];