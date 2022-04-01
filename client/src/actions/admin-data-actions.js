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

    retrieveMyTickets({page, closed = 0, departmentId = 0, pageSize = 10}) {
        return {
            type: 'MY_TICKETS',
            payload: API.call({
                path: '/staff/get-tickets',
                data: {page, closed, departmentId, pageSize}
            })
        };
    },

    retrieveNewTickets({page, departmentId = 0, pageSize = 10}) {
        return {
            type: 'NEW_TICKETS',
            payload: API.call({
                path: '/staff/get-new-tickets',
                data: {page, departmentId, pageSize}
            })
        };
    },

    retrieveAllTickets(page = 1, query = '', closed = 0) {
        return {
            type: 'ALL_TICKETS',
            payload: API.call({
                path: '/staff/get-all-tickets',
                data: {page, query, closed}
            })
        };
    },

    retrieveStaffMembers() {
        return {
            type: 'STAFF_MEMBERS',
            payload: API.call({
                path: '/staff/get-all',
                data: {}
            })
        };
    },

    searchTickets(query, page = 1) {
        return {
            type: 'ALL_TICKETS',
            payload: API.call({
                path: '/staff/search-tickets',
                data: {query, page}
            })
        };
    }
};
