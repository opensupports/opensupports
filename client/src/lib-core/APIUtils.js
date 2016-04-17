const _ = require('lodash');
const $ = require('jquery');

const APIUtils = {

    getPromise(path, method, data) {
        return (resolve, reject) => {
            $.ajax({
                url: path,
                method: method,
                data: data,
                dataType: 'json'
            })
            .done(resolve)
            .fail((jqXHR, textStatus) => {
                reject(textStatus);
            });
        };
    },

    get(path) {
        return new Promise(this.getPromise(path, 'GET'));
    },

    post(path, data) {
        return new Promise(this.getPromise(path, 'POST', data));
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
