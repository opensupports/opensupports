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
        type: React.PropTypes.oneOf([
            'primary',
            'primary-icon',
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
        type: 'primary'
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

        delete props.route;
        delete props.iconName;
        delete props.type;

        return props;
    }

    getClass() {
        let classes = {
            'button': true,
            'button_disabled': this.props.disabled
        };

        classes['button-' + this.props.type] = (this.props.type);
        classes[this.props.className] = (this.props.className);

        return classNames(classes);
    }

    handleClick() {
        if (this.props.route) {
            this.context.router.push(this.props.route.to);
        }
    }
}

export default Button;
