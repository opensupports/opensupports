const _ = require('lodash');
const $ = require('jquery');
const mockjax = require('jquery-mockjax')($, window);

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

_.each(fixtures.getAll(), function (fixture) {
    mockjax({
        contentType: 'application/json',
        url: 'http://localhost:3000/api' + fixture.path,
        responseTime: fixture.time || 500,
        response: function (settings) {
            this.responseText = fixture.response(settings.data);
        }
    });
});
