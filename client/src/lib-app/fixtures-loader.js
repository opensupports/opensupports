const _ = require('lodash');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const qs = require('qs');
const mock = new MockAdapter(axios);

let fixtures = (function () {
    let fixturesData = [];

    return {
        add(fixtures) {
            fixturesData = fixturesData.concat(fixtures);
        },
        getAll() {
            return fixturesData;
        }
    };
})();

// FIXTURES
fixtures.add(require('data/fixtures/user-fixtures'));
fixtures.add(require('data/fixtures/staff-fixtures'));
fixtures.add(require('data/fixtures/ticket-fixtures'));
fixtures.add(require('data/fixtures/system-fixtures'));
fixtures.add(require('data/fixtures/article-fixtures'));

_.each(fixtures.getAll(), function (fixture) {
    mock.onAny('http://localhost:3000/api' + fixture.path).reply(function(config) {
        return new Promise(function(resolve, reject) {
            setTimeout(() => resolve([200, fixture.response(qs.parse(config.data))]), fixture.time || 500);
        });
    });
});
