const _ = require('lodash');
const $ = require('jquery');
const mockjax = require('jquery-mockjax')($, window);

let fixtures = (function () {
    let fixturesData = [];

    return {
        add(fixtures) {
            fixturesData.concat(fixtures);
        },
        getAll() {
            return fixturesData;
        }
    }
})();

// FIXTURES
fixtures.add(require('data/fixtures/user-fixtures'));

_.each(fixtures.getAll(), function (fixture) {
    //ADD FIXTURE TO MOCKJAX
    mockjax({
        contentType: 'application/json',
        url: fixture.path,
        responseTime: fixture.time || 500,
        responseText: JSON.fixture.response
    });
});
