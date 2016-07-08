const _ = require('lodash');
const APIUtils = require('lib-core/APIUtils');
const SessionStorage = require('sessionstorage');

const root = 'http://localhost:3000/api/';

function processData (data) {
    return _.extend({
        userId: SessionStorage.getItem('userId'),
        token: SessionStorage.getItem('token')
    }, data);
}

module.exports = {
    call: function ({path, data, onSuccess, onFail}) {
        APIUtils.post(root + path, processData(data)).then(function (result) {
            if (result.status === 'success') {
                onSuccess && onSuccess(result);
            } else {
                onFail && onFail(result);
            }
        });
    }
};