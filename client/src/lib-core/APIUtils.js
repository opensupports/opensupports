const _ = require('lodash');
const axios = require('axios');
const qs = require('qs');

const APIUtils = {

    getPromise(path, method, data, dataAsForm) {
        return (resolve, reject) => {
            let options = {
                url: path,
                method: method,
                data: data
            };
            
            if(!dataAsForm){
                options.headers = {'content-type': 'application/x-www-form-urlencoded'};
                options.data = qs.stringify(options.data);
            }
            
            axios(options)
            .then((result) => resolve(result.data))
            .catch(() => reject());
        };
    },

    get(path) {
        return new Promise(this.getPromise(path, 'GET'));
    },

    post(path, data, dataAsForm) {
        return new Promise(this.getPromise(path, 'POST', data, dataAsForm));
    },

    patch(path, data) {
        return new Promise(this.getPromise(path, 'PATCH', data));
    },

    put(path, data) {
        return new Promise(this.getPromise(path, 'PUT', data));
    },

    del(path) {
        return new Promise(this.getPromise(path, 'DELETE'));
    }
};

export const getCustomFieldParamName = function (customFieldName) {
    return `customfield_${customFieldName}`.replace(/ /g,'_');
}

export default APIUtils;
