import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import keyCode from 'keycode';

import Icon from 'core-components/icon';

class Menu extends React.Component {

    static propTypes = {
        id: React.PropTypes.string,
        itemsRole: React.PropTypes.string,
        header: React.PropTypes.string,
        type: React.PropTypes.oneOf(['primary', 'secondary', 'navigation', 'horizontal', 'horizontal-list', 'horizontal-list-bright']),
        items: React.PropTypes.arrayOf(React.PropTypes.shape({
            content: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number, React.PropTypes.node]),
            icon: React.PropTypes.string
        })).isRequired,
        selectedIndex: React.PropTypes.number,
        tabbable: React.PropTypes.bool
    };

    static defaultProps = {
        type: 'primary',
        tabbable: false
    };

    state = {
        selectedIndex: this.props.selectedIndex || 0
    };

    render() {
        return (
            <div className={this.getClass()}>
                {this.renderHeader()}
                <ul {...this.getProps()}>
                    {this.props.items.map(this.renderListItem.bind(this))}
                </ul>
            </div>
        )
    }

    renderHeader() {
        let header = null;

        if (this.props.header) {
            header = <div className="menu__header">{this.props.header}</div>;
        }

        return header;
    }

    renderListItem(item, index) {
        let iconNode = null;

        if (item.icon) {
            iconNode = <Icon className="menu__icon" name={item.icon} />;
        }

        return (
            <li {...this.getItemProps(index)}>
                {iconNode}{item.content}
            </li>
        );
    }

    getProps() {
        var props = _.clone(this.props);

        props.className = 'menu__list';

        delete props.itemsRole;
        delete props.header;
        delete props.items;
        delete props.onItemClick;
        delete props.selectedIndex;
        delete props.tabbable;
        delete props.type;

        return props;
    }

    getClass() {
        let classes = {
            'menu': true,
            'menu_secondary': (this.props.type === 'secondary'),
            'menu_navigation': (this.props.type === 'navigation'),
            'menu_horizontal': (this.props.type === 'horizontal'),
            'menu_horizontal-list': (this.props.type === 'horizontal-list'),
            'menu_horizontal-list-bright': (this.props.type === 'horizontal-list-bright')
        };

        classes[this.props.className] = true;

        return classNames(classes);
    }

    getItemProps(index) {
        return {
            id: (this.props.id) ? this.props.id + '__' + index : null,
            className: this.getItemClass(index),
            onClick: this.onItemClick.bind(this, index),
            tabIndex: (this.props.tabbable) ? '0' : null,
            onKeyDown: this.onKeyDown.bind(this, index),
            role: this.props.itemsRole,
            key: index
        };
    }

    getItemClass(index) {
        let classes = {
            'menu__list-item': true,
            'menu__list-item_selected': (this.getSelectedIndex() === index)
        };

        return classNames(classes);
    }

    onKeyDown(index, event) {
        let enterKey = keyCode('ENTER');
        let spaceKey = keyCode('SPACE');

        if(event.keyCode === enterKey || event.keyCode === spaceKey) {
            this.onItemClick(index);
        }
    }

    getSelectedIndex() {
        return (this.props.selectedIndex !== undefined) ? this.props.selectedIndex : this.state.selectedIndex;
    }

    onItemClick(index) {
        const { onItemClick } = this.props;

        this.setState({
            selectedIndex: index
        });

        onItemClick && onItemClick(index);
    }
}

export default Menu;
