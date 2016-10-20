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
    }
};