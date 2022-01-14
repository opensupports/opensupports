import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {Motion, spring} from 'react-motion';
import keyCode from 'keycode';

import Menu from 'core-components/menu';
import Icon from 'core-components/icon';
import Loading from 'core-components/loading'

class DropDown extends React.Component {

    static propTypes = {
        defaultSelectedIndex: React.PropTypes.number,
        selectedIndex: React.PropTypes.number,
        items: Menu.propTypes.items,
        onChange: React.PropTypes.func,
        size: React.PropTypes.oneOf(['small', 'medium', 'large']),
        highlightedIndex: React.PropTypes.number,
        onHighlightedIndexChange: React.PropTypes.func,
        opened: React.PropTypes.bool,
        onMenuToggle: React.PropTypes.func,
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
            opened: false,
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
            style: (this.getOpen()) ? openedStyle : closedStyle
        };
    }

    render() {
        let animation = this.getAnimationStyles();

        return (
            <div className={this.getClass()}>
                <div {...this.getCurrentItemProps()}>
                    {this.props.children ? this.props.children : this.renderCurrentItem()}
                </div>
                <Motion
                    defaultStyle={animation.defaultStyle}
                    style={animation.style}
                    onRest={this.onAnimationFinished.bind(this)}>
                        {this.renderList.bind(this)}
                </Motion>
            </div>
        );
    }

    renderList({opacity, translateY}) {
        let style = {
            opacity: opacity,
            transform: `translateY(${translateY}px)`
        };

        return (
            <div className="drop-down__list-container" style={style}>
                {this.props.loading ?
                    <div><Loading className='drop-down__loading' /></div> :
                    this.props.items.length ?
                        <Menu {...this.getMenuProps()} /> :
                        <div className='drop-down__empty-list'>Empty</div>}
            </div>
        );
    }

    renderCurrentItem() {
        const item = this.props.items[this.getSelectedIndex()];
        let iconNode = null;

        if (item.icon) {
            iconNode = <Icon className="drop-down__current-item-icon" name={item.icon} />;
        }

        return (
            <div>
                {iconNode}{item.contentOnSelected ? item.contentOnSelected : item.content}
            </div>
        );
    }

    getClass() {
        const {
            className,
            size,
        } = this.props;
        
        let classes = {
            'drop-down': true,
            'drop-down_closed': !this.getOpen(),

            ['drop-down_' + size]: (size),
            [className]: (className)
        };

        return classNames(classes);
    }

    getCurrentItemProps() {
        return {
            'aria-expanded': this.getOpen(),
            'aria-autocomplete': 'list',
            'aria-owns': this.state.menuId,
            'aria-activedescendant': this.state.menuId + '__' + this.getHighlightedIndex(),
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
            selectedIndex: this.getHighlightedIndex(),
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
        const highlightedIndex = this.getHighlightedIndex();
        const opened = this.getOpen();
        const itemsQuantity = this.props.items.length;
        const {
            onHighlightedIndexChange,
            onMenuToggle,
        } = this.props;

        return {
            'up': () => {
                if (opened) {
                    const newHighlightedIndex = this.modulo(highlightedIndex - 1, itemsQuantity);
                    event.preventDefault();

                    this.setState({
                        highlightedIndex: newHighlightedIndex,
                    });

                    onHighlightedIndexChange && onHighlightedIndexChange(newHighlightedIndex);
                }
            },
            'down': () => {
                if (opened) {
                    const newHighlightedIndex = this.modulo(highlightedIndex + 1, itemsQuantity);
                    event.preventDefault();

                    this.setState({
                        highlightedIndex: newHighlightedIndex,
                    });

                    onHighlightedIndexChange && onHighlightedIndexChange(newHighlightedIndex);
                }
            },
            'enter': () => {
                event.preventDefault();

                if (opened) {
                    this.onIndexSelected(highlightedIndex);
                } else {
                    this.setState({
                        opened: true
                    });

                    onMenuToggle && onMenuToggle(true);
                }
            },
            'space': () => {
                event.preventDefault();

                this.setState({
                    opened: true
                });

                onMenuToggle && onMenuToggle(true);
            },
            'esc': () => {
                this.setState({
                    opened: false
                });

                onMenuToggle && onMenuToggle(false);
            },
            'tab': () => {
                if (this.getOpen()) {
                    event.preventDefault();

                    onHighlightedIndexChange && this.onIndexSelected(highlightedIndex);
                }
            }
        };
    }

    handleBlur() {
        const { onMenuToggle, } = this.props;

        this.setState({
            opened: false
        });

        onMenuToggle && onMenuToggle(false);
    }

    handleClick() {
        const { onMenuToggle, } = this.props;

        this.setState({
            opened: !this.getOpen()
        });

        onMenuToggle && onMenuToggle(!this.getOpen());
    }

    handleItemClick(index) {
        this.onIndexSelected(index);
    }

    onIndexSelected(index) {
        const {
            onMenuToggle,
            onHighlightedIndexChange,
            onChange,
            loading,
        } = this.props;

        if (!loading){
            this.setState({
                opened: false,
                selectedIndex: index,
                highlightedIndex: index
            });

            onHighlightedIndexChange && onHighlightedIndexChange(index);

            onMenuToggle && onMenuToggle(false);

            onChange && onChange({ index });
        }
    }

    handleListMouseDown(event) {
        event.preventDefault();
    }

    onAnimationFinished() {
        const { onHighlightedIndexChange, } = this.props;


        if (!this.getOpen() && this.getHighlightedIndex() !== this.getSelectedIndex()) {
            this.setState({
                highlightedIndex: this.getSelectedIndex(),
            });

            onHighlightedIndexChange && onHighlightedIndexChange(this.getSelectedIndex());
        }
    }

    getSelectedIndex() {
        const { selectedIndex, } = this.props;
        return (selectedIndex !== undefined) ? selectedIndex : this.state.selectedIndex;
    }

    modulo(number, mod) {
        return ((number % mod) + mod) % mod;
    }

    getOpen(){
        const { opened, } = this.props;
        return (opened !== undefined) ? opened : this.state.opened;
    }

    getHighlightedIndex() {
        const { highlightedIndex, } = this.props;
        return (highlightedIndex !== undefined) ? highlightedIndex : this.state.highlightedIndex;
    }

}

export default DropDown;
