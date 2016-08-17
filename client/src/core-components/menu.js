import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import keyCode from 'keycode';

import Icon from 'core-components/icon';

class Menu extends React.Component {

    static propTypes = {
        header: React.PropTypes.string,
        type: React.PropTypes.oneOf(['primary', 'secondary']),
        items: React.PropTypes.arrayOf(React.PropTypes.shape({
            content: React.PropTypes.string.isRequired,
            icon: React.PropTypes.string
        })).isRequired,
        selectedIndex: React.PropTypes.number,
        tabbable: React.PropTypes.boolean
    };

    static defaultProps = {
        type: 'primary',
        selectedIndex: 0,
        tabbable: false
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
            'menu_secondary': (this.props.type === 'secondary')
        };

        classes[this.props.className] = true;

        return classNames(classes);
    }

    getItemProps(index) {
        return {
            className: this.getItemClass(index),
            onClick: this.onItemClick.bind(this, index),
            tabIndex: (this.props.tabbable) ? '0' : null,
            onKeyDown: this.onKeyDown.bind(this, index),
            key: index
        };
    }

    getItemClass(index) {
        let classes = {
            'menu__list-item': true,
            'menu__list-item_selected': (this.props.selectedIndex === index)
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

    onItemClick(index) {
        if (this.props.onItemClick) {
            this.props.onItemClick(index);
        }
    }
}

export default Menu;