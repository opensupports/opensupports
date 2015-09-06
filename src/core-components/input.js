import React from 'react';

var Input = React.createClass({

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