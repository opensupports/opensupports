import API from 'lib-app/api-call';

export default {
    
    retrieveCustomResponses() {
        return {
            type: 'CUSTOM_RESPONSES',
            payload: API.call({
                path: '/ticket/get-custom-responses',
                data: {}
            })
        };
    },

    retrieveMyTickets() {
        return {
            type: 'MY_TICKETS',
            payload: API.call({
                path: '/staff/get-tickets',
                data: {}
            })
        };
    },

    retrieveNewTickets() {
        return {
            type: 'NEW_TICKETS',
            payload: API.call({
                path: '/staff/get-new-tickets',
                data: {}
            })
        };
    },

    retrieveAllTickets() {
        return {
            type: 'ALL_TICKETS',
            payload: API.call({
                path: '/staff/get-all-tickets',
                data: {}
            })
        };
    }
};