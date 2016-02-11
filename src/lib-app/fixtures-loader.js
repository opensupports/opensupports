const _ = require('lodash');
const $ = require('jquery');
const mockjax = require('jquery-mockjax')($, window);

let fixtures = (function () {
    let fixturesData = [];

    return {
        add(fixtures) {
            fixtures.forEach((fixture) => {
                fixturesData.push(fixture);
            });
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
        url: 'http://localhost:3000/api/' + fixture.path,
        responseTime: fixture.time || 500,
        responseText: fixture.response
    });
});
