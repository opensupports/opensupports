module.exports = [
    {
        path: '/article/get-all',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: [
                    {
                        id: 1,
                        name: 'Membership Settings',
                        icon: 'user',
                        iconColor: '#82CA9C',
                        articles: [
                            {
                                id: '1',
                                title: 'Mannaging apps for your account',
                                content: 'Curabitur sed dignissim turpis, sed lacinia urna. Vestibulum semper suscipit interdum. Proin sed sem gravida massa tristique rhoncus auctor eu diam. Donec fringilla in ex non dignissim. Praesent sed ultricies eros. Nullam vel augue eget libero volutpat sodales sit amet et orci.',
                                lastEdited: 201605161230,
                                position: 1
                            },
                            {
                                id: '2',
                                title: 'How to assign new task and files',
                                content: 'Aliquam aliquet mi nulla. Nam vel orci diam. Suspendisse euismod orci efficitur nulla mattis eleifend vitae quis neque. Etiam orci dolor, dignissim quis convallis quis, rhoncus eu tellus. Phasellus aliquam ut enim id ultrices. Nunc dolor arcu, viverra vel ullamcorper nec, dignissim a lectus. Praesent fringilla, neque nec suscipit placerat, augue elit suscipit velit, in feugiat leo justo id tortor.',
                                lastEdited: 201504291029,
                                position: 2
                            },
                            {
                                id: '3',
                                title: 'Updating your profile picture',
                                content: 'Aliquam aliquet mi nulla. Nam vel orci diam. Suspendisse euismod orci efficitur nulla mattis eleifend vitae quis neque. Etiam orci dolor, dignissim quis convallis quis, rhoncus eu tellus. Phasellus aliquam ut enim id ultrices. Nunc dolor arcu, viverra vel ullamcorper nec, dignissim a lectus. Praesent fringilla, neque nec suscipit placerat, augue elit suscipit velit, in feugiat leo justo id tortor.',
                                lastEdited: 201504291422,
                                position: 3
                            },
                            {
                                id: '4',
                                title: 'Deleting your account',
                                content: 'Aliquam aliquet mi nulla. Nam vel orci diam. Suspendisse euismod orci efficitur nulla mattis eleifend vitae quis neque. Etiam orci dolor, dignissim quis convallis quis, rhoncus eu tellus. Phasellus aliquam ut enim id ultrices. Nunc dolor arcu, viverra vel ullamcorper nec, dignissim a lectus. Praesent fringilla, neque nec suscipit placerat, augue elit suscipit velit, in feugiat leo justo id tortor.',
                                lastEdited: 201509290102,
                                position: 4
                            },
                            {
                                id: '5',
                                title: 'Upload files to your cloud drive',
                                content: 'Aliquam aliquet mi nulla. Nam vel orci diam. Suspendisse euismod orci efficitur nulla mattis eleifend vitae quis neque. Etiam orci dolor, dignissim quis convallis quis, rhoncus eu tellus. Phasellus aliquam ut enim id ultrices. Nunc dolor arcu, viverra vel ullamcorper nec, dignissim a lectus. Praesent fringilla, neque nec suscipit placerat, augue elit suscipit velit, in feugiat leo justo id tortor.',
                                lastEdited: 201312290549,
                                position: 5
                            }
                        ]
                    },
                    {
                        id: 2,
                        name: 'Billing and plans',
                        icon: 'credit-card',
                        iconColor: 'red',
                        articles: [
                            {
                                id: '1',
                                title: 'Mannaging apps for your account',
                                content: 'Curabitur sed dignissim turpis, sed lacinia urna. Vestibulum semper suscipit interdum. Proin sed sem gravida massa tristique rhoncus auctor eu diam. Donec fringilla in ex non dignissim. Praesent sed ultricies eros. Nullam vel augue eget libero volutpat sodales sit amet et orci.',
                                lastEdited: 201605161200,
                                position: 1
                            },
                            {
                                id: '2',
                                title: 'How to assign new task and files',
                                content: 'Aliquam aliquet mi nulla. Nam vel orci diam. Suspendisse euismod orci efficitur nulla mattis eleifend vitae quis neque. Etiam orci dolor, dignissim quis convallis quis, rhoncus eu tellus. Phasellus aliquam ut enim id ultrices. Nunc dolor arcu, viverra vel ullamcorper nec, dignissim a lectus. Praesent fringilla, neque nec suscipit placerat, augue elit suscipit velit, in feugiat leo justo id tortor.',
                                lastEdited: 201504291159,
                                position: 2
                            },
                            {
                                id: '3',
                                title: 'Updating your profile picture',
                                content: 'Aliquam aliquet mi nulla. Nam vel orci diam. Suspendisse euismod orci efficitur nulla mattis eleifend vitae quis neque. Etiam orci dolor, dignissim quis convallis quis, rhoncus eu tellus. Phasellus aliquam ut enim id ultrices. Nunc dolor arcu, viverra vel ullamcorper nec, dignissim a lectus. Praesent fringilla, neque nec suscipit placerat, augue elit suscipit velit, in feugiat leo justo id tortor.',
                                lastEdited: 201504291222,
                                position: 3
                            },
                            {
                                id: '4',
                                title: 'Deleting your account',
                                content: 'Aliquam aliquet mi nulla. Nam vel orci diam. Suspendisse euismod orci efficitur nulla mattis eleifend vitae quis neque. Etiam orci dolor, dignissim quis convallis quis, rhoncus eu tellus. Phasellus aliquam ut enim id ultrices. Nunc dolor arcu, viverra vel ullamcorper nec, dignissim a lectus. Praesent fringilla, neque nec suscipit placerat, augue elit suscipit velit, in feugiat leo justo id tortor.',
                                lastEdited: 201509292359,
                                position: 4
                            },
                            {
                                id: '5',
                                title: 'Upload files to your cloud drive',
                                content: 'Aliquam aliquet mi nulla. Nam vel orci diam. Suspendisse euismod orci efficitur nulla mattis eleifend vitae quis neque. Etiam orci dolor, dignissim quis convallis quis, rhoncus eu tellus. Phasellus aliquam ut enim id ultrices. Nunc dolor arcu, viverra vel ullamcorper nec, dignissim a lectus. Praesent fringilla, neque nec suscipit placerat, augue elit suscipit velit, in feugiat leo justo id tortor.',
                                lastEdited: 201312290000,
                                position: 5
                            }
                        ]
                    }
                ]
            };
        }
    },
    {
        path: '/article/edit-topic',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/article/edit',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/article/add',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/article/add-topic',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/article/delete',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/article/delete-topic',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    }
];
