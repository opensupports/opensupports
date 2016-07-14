const React = require('react');
const _ = require('lodash');

module.exports = function (options) {
    return React.createClass(_.extend({
        render() {
            return <div>{this.props.children}</div>;
        }
    }, options));
};