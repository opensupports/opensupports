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
    }
};