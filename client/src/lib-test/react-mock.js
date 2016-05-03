const React = require('react');

module.exports = function () {
    return React.createClass({
        render() {
            return <div {...this.props} />;
        }
    });
};