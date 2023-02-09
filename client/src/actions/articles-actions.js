import API from 'lib-app/api-call';

export default {

    initArticles() {
        return {
            type: 'INIT_ARTICLES',
            payload: {}
        };
    },
    
    retrieveArticles() {
        return {
            type: 'GET_ARTICLES',
            payload: API.call({
                path: '/article/get-all',
                data: {}
            })
        };
    }
};