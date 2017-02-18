const _ = require('lodash');
const $ = require('jquery');

const APIUtils = {

    getPromise(path, method, data, dataAsForm) {
        return (resolve, reject) => {
            let options = {
                url: path,
                method: method,
                data: data
            };
            
            if(dataAsForm) {
                options = {
                    url: path,
                    type: method,
                    data: data,
                    processData: false,
                    contentType: false
                };
            }
            
            $.ajax(options)
            .done(resolve)
            .fail((jqXHR, textStatus) => {
                reject(textStatus);
            });
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

export default APIUtils;
