const _ = require('lodash');
const APIUtils = require('lib-core/APIUtils');
const SessionStore = require('lib-app/session-store');

const url = 'http://localhost:3000';
const apiUrl = 'http://localhost:3000/api';

function processData (data, dataAsForm = false) {
    let newData;
    
    if(dataAsForm) {
        newData = new FormData();

        _.each(data, (value, key) => {
            newData.append(key, value);
        });

        newData.append('csrf_token', SessionStore.getSessionData().token);
        newData.append('csrf_userid', SessionStore.getSessionData().userId);
    } else {
        newData = _.extend({
            csrf_token: SessionStore.getSessionData().token,
            csrf_userid: SessionStore.getSessionData().userId
        }, data)
    }
    
    return newData;
}

module.exports = {
    call: function ({path, data, plain, dataAsForm}) {
        return new Promise(function (resolve, reject) {
            APIUtils.post(apiUrl + path, processData(data, dataAsForm), dataAsForm)
                .then(function (result) {
                    console.log(result);

                    if (plain || result.status === 'success') {
                        resolve(result);
                    } else if (reject) {
                        reject(result);
                    }
                })
                .catch(function (result) {
                    console.log('INVALID REQUEST');
                    console.log(result);
                    reject({
                        status: 'fail',
                        message: 'Internal server error'
                    });
                });
        });
    },
    
    getFileLink(filePath) {
        return apiUrl + '/system/download?file=' + filePath;
    },
    
    getAPIUrl() {
        return apiUrl;
    },
    
    getURL() {
        return url;
    }
};