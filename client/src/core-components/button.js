// VENDOR LIBS
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

// CORE LIBS
import callback from 'lib-core/callback';

// CORE COMPONENTS
import Icon from 'core-components/icon';

class Button extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object
    };

    static propTypes = {
        children: React.PropTypes.node,
        inverted: React.PropTypes.bool,
        size: React.PropTypes.oneOf([
            'extra-small',
            'small',
            'medium',
            'large',
            'auto'
        ]),
        type: React.PropTypes.oneOf([
            'primary',
            'secondary',
            'tertiary',
            'clean',
            'link'
        ]),
        route: React.PropTypes.shape({
            to: React.PropTypes. string.isRequired,
            params: React.PropTypes.object,
            query: React.PropTypes.query
        }),
        iconName: React.PropTypes.string
    };

    static defaultProps = {
        type: 'primary',
        size: 'large'
    };

    render() {
        return (
            <button {...this.getProps()}>
                {(this.props.iconName) ? <Icon size="sm" name={this.props.iconName}/> : this.props.children}
            </button>
        );
    }

    getProps() {
        let props = _.clone(this.props);

        props.onClick = callback(this.handleClick.bind(this), this.props.onClick);
        props.className = this.getClass();
        props.ref = 'button';

        delete props.route;
        delete props.iconName;
        delete props.type;
        delete props.inverted;

        return props;
    }

    getClass() {
        let classes = {
            'button': true,
            'button_disabled': this.props.disabled,
            'button_inverted': this.props.inverted,

            'button_primary': (this.props.type === 'primary'),
            'button_secondary': (this.props.type === 'secondary'),
            'button_tertiary': (this.props.type === 'tertiary'),
            'button_clean': (this.props.type === 'clean'),
            'button_link': (this.props.type === 'link'),

            'button_extra-small': (this.props.size === 'extra-small'),
            'button_small': (this.props.size === 'small'),
            'button_medium': (this.props.size === 'medium'),
            'button_large': (this.props.size === 'large'),
            'button_auto': (this.props.size === 'auto')
        };

        classes[this.props.className] = (this.props.className);

        return classNames(classes);
    }

    handleClick() {
        if (this.props.route) {
            this.context.router.push(this.props.route.to);
        }
    }

    focus() {
        this.refs.button.focus();
    }
}

export default Button;
