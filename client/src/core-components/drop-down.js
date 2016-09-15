import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {Motion, spring} from 'react-motion';
import keyCode            from 'keycode';

import Menu from 'core-components/menu';
import Icon from 'core-components/icon';

class DropDown extends React.Component {

    static propTypes = {
        defaultSelectedIndex: React.PropTypes.number,
        selectedIndex: React.PropTypes.number,
        items: Menu.propTypes.items,
        onChange: React.PropTypes.func,
        size: React.PropTypes.oneOf(['small', 'medium', 'large'])
    };

    static defaultProps = {
        defaultSelectedIndex: 0
    };

    constructor(props) {
        super(props);

        this.state = {
            menuId: _.uniqueId('drop-down-menu_'),
            selectedIndex: props.selectedIndex || props.defaultSelectedIndex,
            highlightedIndex: props.selectedIndex || props.defaultSelectedIndex,
            opened: false
        };
    }

    getAnimationStyles() {
        let closedStyle = {
            opacity: spring(0, [200, 20]),
            translateY: spring(20, [200, 20])
        };
        let openedStyle = {
            opacity: spring(1, [200, 20]),
            translateY: spring(0, [200, 20])
        };

        return {
            defaultStyle: {opacity: 0, translateY: 20},
            style: (this.state.opened) ? openedStyle : closedStyle
        };
    }

    render() {
        let animation = this.getAnimationStyles();
        let selectedItem = this.props.items[this.getSelectedIndex()];

        return (
            <div className={this.getClass()}>
                {this.renderCurrentItem(selectedItem)}
                <Motion defaultStyle={animation.defaultStyle} style={animation.style} onRest={this.onAnimationFinished.bind(this)}>
                    {this.renderList.bind(this)}
                </Motion>
            </div>
        );
    }

    renderList({opacity, translateY}) {
        let style = { opacity: opacity, transform: `translateY(${translateY}px)`};

        return (
            <div className="drop-down__list-container" style={style}>
                <Menu {...this.getMenuProps()} />
            </div>
        );
    }

    renderCurrentItem(item) {
        var iconNode = null;

        if (item.icon) {
            iconNode = <Icon className="drop-down__current-item-icon" name={item.icon} />;
        }

        return (
            <div {...this.getCurrentItemProps()}>
                {iconNode}{item.content}
            </div>
        );
    }

    getClass() {
        let classes = {
            'drop-down': true,
            'drop-down_closed': !this.state.opened,

            ['drop-down_' + this.props.size]: (this.props.size),
            [this.props.className]: (this.props.className)
        };

        return classNames(classes);
    }

    getCurrentItemProps() {
        return {
            'aria-expanded': this.state.opened,
            'aria-autocomplete': 'list',
            'aria-owns': this.state.menuId,
            'aria-activedescendant': this.state.menuId + '__' + this.state.highlightedIndex,
            className: 'drop-down__current-item',
            onClick: this.handleClick.bind(this),
            onKeyDown: this.onKeyDown.bind(this),
            onBlur: this.handleBlur.bind(this),
            role: 'combobox',
            tabIndex: 0
        };
    }

    getMenuProps() {
        return {
            id: this.state.menuId,
            itemsRole: 'option',
            items: this.props.items,
            onItemClick: this.handleItemClick.bind(this),
            onMouseDown: this.handleListMouseDown.bind(this),
            selectedIndex: this.state.highlightedIndex,
            role: 'listbox'
        };
    }

    onKeyDown(event) {
        const keyActions = this.getKeyActions(event);
        const keyAction = keyActions[keyCode(event)];

        if (keyAction) {
            keyAction();
        }
    }

    getKeyActions(event) {
        const {highlightedIndex, opened} = this.state;
        const itemsQuantity = this.props.items.length;

        return {
            'up': () => {
                if (opened) {
                    event.preventDefault();

                    this.setState({
                        highlightedIndex: this.modulo(highlightedIndex - 1, itemsQuantity)
                    });
                }
            },
            'down': () => {
                if (opened) {
                    event.preventDefault();

                    this.setState({
                        highlightedIndex: this.modulo(highlightedIndex + 1, itemsQuantity)
                    });
                }
            },
            'enter': () => {
                if (opened) {
                    this.onIndexSelected(highlightedIndex);
                } else {
                    this.setState({
                        opened: true
                    });
                }
            },
            'space': () => {
                event.preventDefault();

                this.setState({
                    opened: true
                });
            },
            'esc': () => {
                this.setState({
                    opened: false
                });
            },
            'tab': () => {
                if (this.state.opened) {
                    event.preventDefault();

                    this.onIndexSelected(highlightedIndex)
                }
            }
        };
    }

    handleBlur() {
        this.setState({
            opened: false
        });
    }

    handleClick() {
        this.setState({
            opened: !this.state.opened
        });
    }

    handleItemClick(index) {
        this.onIndexSelected(index);
    }

    onIndexSelected(index) {
        this.setState({
            opened: false,
            selectedIndex: index,
            highlightedIndex: index
        });

        if (this.props.onChange) {
            this.props.onChange({
                index
            });
        }
    }

    handleListMouseDown(event) {
        event.preventDefault();
    }

    onAnimationFinished() {
        if (!this.state.opened && this.state.highlightedIndex !== this.getSelectedIndex()) {
            this.setState({
                highlightedIndex: this.getSelectedIndex()
            });
        }
    }

    getSelectedIndex() {
        return (this.props.selectedIndex !== undefined) ? this.props.selectedIndex : this.state.selectedIndex;
    }

    modulo(number, mod) {
        return ((number % mod) + mod) % mod;
    }
}

export default DropDown;
