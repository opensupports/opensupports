import React from 'react';

class Header extends React.Component {
    static propTypes = {
        title: React.PropTypes.string.isRequired,
        description: React.PropTypes.string
    };

    render() {
        return (
            <div className="header">
                <h2 className="header__title">{this.props.title}</h2>
                {(this.props.description) ? this.renderDescription() : null}
            </div>
        )
    }

    renderDescription() {
        return (
            <div className="header__description">
                {this.props.description}
            </div>
        )
    }
}

export default Header;