var jsdom = require('jsdom').jsdom;

global.document = jsdom('<html><body></body></html>');
global.window = document.defaultView;
global.navigator = {
    userAgent: 'node.js'
};
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
