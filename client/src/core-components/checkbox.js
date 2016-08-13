import React              from 'react';
import classNames         from 'classnames';
import _                  from 'lodash';

import callback           from 'lib-core/callback';
import getIcon            from 'lib-core/get-icon';

class CheckBox extends React.Component {

    static propTypes = {
        alignment: React.PropTypes.string,
        label: React.PropTypes.string,
        value: React.PropTypes.bool
    };

    static defaultProps = {
        alignment: 'right'
    };

    constructor(props) {
        super(props);

        this.state = {
            checked: false
        };
    }

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
    }

    getProps() {
        let props = _.clone(this.props);

        props.type = 'checkbox';

        props['aria-hidden'] = true;
        props.className = 'checkbox--box';
        props.checked = this.getValue();
        props.onChange = callback(this.handleChange.bind(this), this.props.onChange);

        delete props.alignment;
        delete props.error;
        delete props.label;
        delete props.value;

        return props;
    }

    getClass() {
        let classes = {
            'checkbox': true,
            'checkbox_checked': this.state.checked,

            [this.props.className]: (this.props.className)
        };

        return classNames(classes);
    }

    getIconProps() {
        return {
            'aria-checked': this.getValue(),
            className: 'checkbox--icon',
            onKeyDown: callback(this.handleIconKeyDown.bind(this), this.props.onKeyDown),
            role: "checkbox",
            tabIndex: 0
        };
    }

    getValue() {
        return (this.props.value === undefined) ? this.state.checked : this.props.value;
    }

    handleChange(event) {
        this.setState({
            checked: event.target.checked
        });
    }

    handleIconKeyDown(event) {
        if (event.keyCode == 32) {
            event.preventDefault();

            callback(this.handleChange.bind(this), this.props.onChange)({
                target: {
                    checked: !this.state.checked
                }
            });
        }
    }
}

export default CheckBox;
