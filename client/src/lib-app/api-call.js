const _ = require('lodash');
const APIUtils = require('lib-core/APIUtils');
const SessionStore = require('lib-app/session-store');

const root = 'http://localhost:3000/api';

function processData (data) {
    return _.extend({
        csrf_token: SessionStore.getSessionData().token,
        csrf_userid: SessionStore.getSessionData().userId
    }, data);
}

module.exports = {
    call: function ({path, data}) {
        return new Promise(function (resolve, reject) {
            APIUtils.post(root + path, processData(data))
                .then(function (result) {
                    console.log(result);

                    if (result.status === 'success') {
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
    }
};