const React = require('react');
const classNames = require('classnames');

const Icon = React.createClass({

    propTypes: {
        name: React.PropTypes.string.isRequired,
        size: React.PropTypes.number
    },

    getDefaultProps() {
        return {
            size: 0
        };
    },

    render() {
        return (this.props.name.length > 2) ? this.renderFontIcon() : this.renderFlag();
    },

    renderFontIcon() {
        return (
            <span className={this.getFontIconClass()} aria-hidden="true" />
        );
    },

    renderFlag() {
        return (
            <img className={this.props.className} src={`/images/icons/${this.props.name}.png`} aria-hidden="true" />
        );
    },

    getFontIconClass() {
        let classes = {
            'fa': true,
            ['fa-' + this.props.name]: true,
            ['fa-' + this.props.size]: true,
            [this.props.className]: true
        };

        return classNames(classes);
    }
});

export default Icon;
