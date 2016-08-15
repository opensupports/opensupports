import React from 'react';
import classNames from 'classnames';

class Icon extends React.Component {

    static propTypes = {
        name: React.PropTypes.string.isRequired,
        size: React.PropTypes.string
    };

    static defaultProps = {
        size: 'lg'
    };

    render() {
        return (this.props.name.length > 2) ? this.renderFontIcon() : this.renderFlag();
    }

    renderFontIcon() {
        return (
            <span className={this.getFontIconClass()} aria-hidden="true" />
        );
    }

    renderFlag() {
        return (
            <img className={this.props.className} src={`/images/icons/${this.props.name}.png`} aria-hidden="true" />
        );
    }

    getFontIconClass() {
        let classes = {
            'fa': true,
            ['fa-' + this.props.name]: true,
            ['fa-' + this.props.size]: true,
            [this.props.className]: true
        };

        return classNames(classes);
    }
}

export default Icon;
