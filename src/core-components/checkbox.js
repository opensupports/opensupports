import React              from 'react';
import classNames         from 'classnames';
import _                  from 'lodash';

import callback           from 'lib/callback';
import getIcon            from 'lib/get-icon';

var CheckBox = React.createClass({

    propTypes: {
        alignment: React.PropTypes.string,
        label: React.PropTypes.string,
        value: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            alignment: 'right'
        };
    },

    getInitialState() {
        return {
            checked: false
        };
    },

    render() {
        return (
            <label className={this.getClass()}>
                <span {...this.getIconProps()}>
                    {getIcon((this.getValue()) ? 'check-square' : 'square', 'lg') }
                </span>
                <span className="checkbox--label">{this.props.label}</span>
                <input {...this.getProps()}/>
            </label>
        );
    },

    getProps() {
        var props = _.clone(this.props);

        props.type = 'checkbox';

        props['aria-hidden'] = true;
        props.className = 'checkbox--box';
        props.checked = this.getValue();
        props.onChange = callback(this.handleChange, this.props.onChange);
        props.value = null;

        return props;
    },

    getClass() {
        var classes = {
            'checkbox': true,
            'checkbox_checked': this.state.checked,

            [this.props.className]: (this.props.className)
        };

        return classNames(classes);
    },

    getIconProps() {
        return {
            'aria-checked': this.getValue(),
            className: 'checkbox--icon',
            onKeyDown: callback(this.handleIconKeyDown, this.props.onKeyDown),
            role: "checkbox",
            tabIndex: 0
        };
    },

    getValue() {
        return (this.props.value === undefined) ? this.state.checked : this.props.value;
    },

    handleChange: function (event) {
        this.setState({
            checked: event.target.checked
        });
    },

    handleIconKeyDown: function (event) {
        if (event.keyCode == 32) {
            event.preventDefault();

            callback(this.handleChange, this.props.onChange)({
                target: {
                    checked: !this.state.checked
                }
            });
        }
    }
});

export default CheckBox;