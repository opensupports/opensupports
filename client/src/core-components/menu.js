const React = require('react');
const _ = require('lodash');
const classNames = require('classnames');

const Icon = require('core-components/icon');

const Menu = React.createClass({

    propTypes: {
        type: React.PropTypes.oneOf(['primary', 'secondary']),
        items: React.PropTypes.arrayOf(React.PropTypes.shape({
            content: React.PropTypes.string.isRequired,
            icon: React.PropTypes.string
        })).isRequired,
        selectedIndex: React.PropTypes.number
    },

    getDefaultProps() {
        return {
            type: 'primary',
            selectedIndex: 0
        };
    },

    render() {
        return (
            <ul {...this.getProps()}>
                {this.props.items.map(this.renderListItem)}
            </ul>
        )
    },

    renderListItem(item, index) {
        return (
            <li {...this.getItemProps(index)}>
                {this.renderItem(item)}
            </li>
        );
    },

    renderItem(item) {
        return (
            <span>
                {(item.icon) ? this.renderIcon(item.icon) : null}{item.content}
            </span>
        );
    },

    renderIcon(icon) {
        return (
            <Icon className="menu--icon" name={icon} />
        );
    },

    getProps() {
        var props = _.clone(this.props);

        props.className = this.getClass();
        props.type = null;

        return props;
    },

    getClass() {
        let classes = {
            'menu': true,
            'menu_secondary': (this.props.type === 'secondary')
        };

        return classNames(classes);
    },

    getItemProps(index) {
        return {
            className: this.getItemClass(index),
            onClick: this.handleItemClick.bind(this, index),
            key: index
        };
    },

    getItemClass(index) {
        let classes = {
            'menu--list-item': true,
            'menu--list-item_selected': (this.props.selectedIndex === index)
        };

        return classNames(classes);
    },

    handleItemClick(index) {
        if (this.props.onItemClick) {
            this.props.onItemClick(index);
        }
    }
});

export default Menu;