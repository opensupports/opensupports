import React              from 'react';
import classNames         from 'classnames';
import _                  from 'lodash';
import keyCode            from 'keycode';

import callback           from 'lib-core/callback';
import getIcon            from 'lib-core/get-icon';

class CheckBox extends React.Component {

    static propTypes = {
        alignment: React.PropTypes.string,
        label: React.PropTypes.node,
        value: React.PropTypes.bool,
        wrapInLabel: React.PropTypes.bool,
        onChange: React.PropTypes.func
    };

    static defaultProps = {
        wrapInLabel: false,
        alignment: 'right'
    };

    state = {
        checked: false
    };

    render() {
        let Wrapper = (this.props.wrapInLabel) ? 'label' : 'span';

        return (
            <Wrapper className={this.getClass()}>
                <span {...this.getIconProps()}>
                    {getIcon((this.getValue()) ? 'check-square' : 'square', 'lg') }
                </span>
                <input {...this.getProps()}/>
                {(this.props.label) ? this.renderLabel() : null}
            </Wrapper>
        );
    }

    renderLabel() {
        return (
            <span className="checkbox__label">
                {this.props.label}
            </span>
        );
    }

    getProps() {
        let props = _.clone(this.props);

        props.type = 'checkbox';

        props['aria-hidden'] = true;
        props.className = 'checkbox__box';
        props.checked = this.getValue();
        props.onChange = callback(this.handleChange.bind(this), this.props.onChange);

        delete props.alignment;
        delete props.errored;
        delete props.label;
        delete props.value;
        delete props.wrapInLabel;

        return props;
    }

    getClass() {
        const {
            className,
            disabled
        } = this.props;
        let classes = {
            'checkbox': true,
            'checkbox_checked': this.getValue(),
            'checkbox_disabled': disabled,

            [className]: (className)
        };

        return classNames(classes);
    }

    getIconProps() {
        return {
            'aria-checked': this.getValue(),
            className: 'checkbox__icon',
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
        if (event.keyCode === keyCode('SPACE')) {
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
