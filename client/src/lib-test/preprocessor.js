'use strict';

var jsdom = require('jsdom').jsdom;

global.document = jsdom('<html><body></body></html>', {
    url: 'http://localhost'
});
global.window = document.defaultView;
global.Node = global.window.Node;
global.navigator = global.window.navigator;
global.React = require('react');
global.ReactDOM = require('react-dom');
global.chai = require('chai');
global.expect = chai.expect;
global.sinon = require('sinon');
global.stub = sinon.stub;
global.spy = sinon.spy;
global.proxyquire = require('proxyquire');
global.ReactMock  = require('lib-test/react-mock');
chai.use(require('sinon-chai'));
global.TestUtils = require('react-addons-test-utils');
global.requireUnit = function (path, mocks) {
    return proxyquire(process.cwd() + '/src/' + path + '.js', mocks)
};
global.reRenderIntoDocument = (function () {
    let div;

    return function (jsx) {
        if (!div) {
            div = document.createElement('div')
        }

        return ReactDOM.render(jsx, div);
    }
})();
global.ReduxMock = {
    connect: stub().returns(stub().returnsArg(0))
};
global.globalIndexPath = '';

Array.prototype.swap = function (x,y) {
    var b = this[x];
    this[x] = this[y];
    this[y] = b;
    return this;
};
