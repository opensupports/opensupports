const React = require('react');
const classNames = require('classnames');
const _ = require('lodash');

const Icon = require('core-components/icon');

const Input = React.createClass({

    propTypes: {
        value: React.PropTypes.string,
        validation: React.PropTypes.string,
        onChange: React.PropTypes.func,
        inputType: React.PropTypes.string,
        password: React.PropTypes.bool,
        required: React.PropTypes.bool,
        icon: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            inputType: 'primary'
        };
    },

    render() {
        return (
            <label className={this.getClass()}>
                <span className="input__label">{this.props.label}</span>
                {this.renderIcon()}
                <input {...this.getInputProps()} className="input__text" />
            </label>
        );
    },

    renderIcon() {
        let icon = null;

        if (this.props.icon) {
            icon = <span className="input__icon"><Icon name={this.props.icon} /></span>
        }

        return icon;
    },

    getInputProps() {
        let props = _.clone(this.props);

        props.required = null;
        props['aria-required'] = this.props.required;
        props.type = (this.props.password) ? 'password' : 'text';
        props.ref = 'nativeInput';

        return props;
    },

    getClass() {
        let classes = {
            'input': true,
            'input_with-icon': (this.props.icon),
            ['input_' + this.props.inputType]: true,

            [this.props.className]: (this.props.className)
        };

        return classNames(classes);
    },

    focus() {
        if (this.refs.nativeInput) {
            this.refs.nativeInput.focus();
        }
    }
});

export default Input;
