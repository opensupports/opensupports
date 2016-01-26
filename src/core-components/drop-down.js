import React              from 'react';
import classNames         from 'classnames';
import _                  from 'lodash';
import {Motion, spring}   from 'react-motion';

import callback           from 'lib/callback';

let DropDown = React.createClass({

    propTypes: {
        defaultSelectedIndex: React.PropTypes.number,
        selectedIndex: React.PropTypes.number,

        items: React.PropTypes.arrayOf(React.PropTypes.shape({
            content: React.PropTypes.node.isRequired,
            icon: React.PropTypes.string
        })).isRequired
    },

    getDefaultProps() {
        return {
            defaultSelectedIndex: 0
        };
    },

    getInitialState() {
        return {
            selectedIndex: 0,
            opened: false
        };
    },

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
            defaultStyle: closedStyle,
            style: (this.state.opened) ? openedStyle : closedStyle
        };
    },

    render() {
        let animation = this.getAnimationStyles();

        return (
            <div className={this.getClass()}>
                <div className="drop-down--current" onBlur={this.handleBlur} onClick={this.handleClick} tabIndex="0" ref="current">
                    {this.props.items[this.getSelectedIndex()].content}
                </div>
                <Motion defaultStyle={animation.defaultStyle} style={animation.style}>
                    {this.renderList}
                </Motion>
            </div>
        );
    },

    renderList({opacity, translateY}) {
        let style = { opacity: opacity, transform: `translateY(${translateY}px)`};

        return (
            <div className="drop-down--list-container" style={style}>
                <ul className="drop-down--list">
                    {this.props.items.map(this.renderItem)}
                </ul>
            </div>
        );
    },

    renderItem(item, index) {
        return (
            <li {...this.getItemProps(index)}>
                {item.content}
            </li>
        );
    },

    getClass() {
        let classes = {
            'drop-down': true,

            [this.props.className]: (this.props.className)
        };

        return classNames(classes);
    },

    getItemProps(index) {
        return {
            className: 'drop-down--list-item',
            onClick: this.handleItemClick.bind(this, index),
            onMouseDown: this.handleItemMouseDown,
            key: index
        };
    },

    handleBlur() {
        this.setState({
            opened: false
        });
    },

    handleClick() {
        this.setState({
            opened: !this.state.opened
        });
    },

    handleItemClick(index) {
        this.setState({
            opened: false,
            selectedIndex: index
        });

        if (this.props.onChange) {
            this.props.onChange({
                index
            });
        }
    },

    handleItemMouseDown(event) {
        event.preventDefault();
    },

    getSelectedIndex() {
        return (this.props.selectedIndex !== undefined) ? this.props.selectedIndex : this.state.selectedIndex;
    }
});

export default DropDown;
