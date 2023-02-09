import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import Icon from 'core-components/icon';

class Input extends React.Component {

    static contextTypes = {
        loading: React.PropTypes.bool
    };

    static propTypes = {
        value: React.PropTypes.string,
        validation: React.PropTypes.string,
        onChange: React.PropTypes.func,
        size: React.PropTypes.oneOf(['small', 'medium', 'large', 'auto']),
        password: React.PropTypes.bool,
        required: React.PropTypes.bool,
        icon: React.PropTypes.string,
        error: React.PropTypes.string,
        onIconClick: React.PropTypes.func
    };

    static defaultProps = {
        size: 'small',
        value: ''
    };

    render() {
        return (
            <span className={this.getClass()}>
                {this.renderIcon()}
                <input {...this.getInputProps()} className="input__text" />
            </span>
        );
    }

    renderIcon() {
        let icon = null;

        if (this.props.icon) {
            icon = <span className="input__icon" onClick={this.onIconClick.bind(this)}><Icon name={this.props.icon} /></span>
        }

        return icon;
    }

    getInputProps() {
        let props = _.clone(this.props);

        props['aria-required'] = this.props.required;
        props.type = (this.props.password) ? 'password' : 'text';
        props.ref = 'nativeInput';

        delete props.errored;
        delete props.required;
        delete props.validation;
        delete props.inputType;
        delete props.errored;
        delete props.password;
        delete props.onIconClick;

        return props;
    }

    getClass() {
        let classes = {
            'input': true,
            'input_with-icon': (this.props.icon),
            'input_errored': (this.props.errored),
            'input_icon-clickable': (this.props.onIconClick),
            ['input_' + this.props.size]: true,

            [this.props.className]: (this.props.className)
        };

        return classNames(classes);
    }

    onIconClick(event) {
        if(this.props.onIconClick) {
            event.preventDefault();
            this.focus();
            this.props.onIconClick(event);
        }
    }

    focus() {
        if (this.refs.nativeInput) {
            this.refs.nativeInput.focus();
        }
    }
}

export default Input;
