const _ = require('lodash');
const APIUtils = require('lib-core/APIUtils').default;
const SessionStore = require('lib-app/session-store').default;

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
        if(showLogs) console.log('request ' + path, data);
        return new Promise(function (resolve, reject) {
            APIUtils.post(apiRoot + path, processData(data, dataAsForm), dataAsForm)
                .then(function (result) {
                    if(showLogs) console.log(result);

                    if (plain || result.status === 'success') {
                        resolve(result);
                    } else if (reject) {
                        reject(result);
                    }
                })
                .catch(function (result) {
                    console.log('INVALID REQUEST to: ' + path);
                    console.log(result);
                    reject({
                        status: 'fail',
                        message: 'Internal server error'
                    });
                });
        });
    },

    getFileLink(filePath) {
        return apiRoot + '/system/download?file=' + filePath;
    },

    getAPIUrl() {
        return apiRoot;
    },

    getURL() {
        return root;
    }
};
