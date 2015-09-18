import React from 'react';

var Input = React.createClass({

    propTypes: {
        value: React.PropTypes.string,
        validation: React.PropTypes.func,
        onChange: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            value: ''
        };
    },

    render() {
        return (
            <input {...this.getProps()} />
        );
    },

    getProps() {
        return this.props;
    }
});

export default Input;