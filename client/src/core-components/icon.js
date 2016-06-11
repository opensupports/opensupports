import React from 'react';

let Icon = React.createClass({

    propTypes: {
        name: React.PropTypes.string.isRequired
    },

    render() {
        return (
            <img className={this.props.className} src={`../images/icons/${this.props.name}.png`} />
        );
    }

});

export default Icon;
