import React              from 'react';
import classNames         from 'classnames';
import _                  from 'lodash';
import {Motion, spring}   from 'react-motion';


import callback           from 'lib/callback';

var DropDown = React.createClass({

    propTypes: {
        defaultSelectedIndex: React.PropTypes.number,
        selectedIndex: React.PropTypes.number,

        items: React.PropTypes.array.isRequired
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
        var closedStyle = {
            opacity: spring(0, [200, 20]),
            translateY: spring(20, [200, 20])
        };
        var openedStyle = {
            opacity: spring(1, [200, 20]),
            translateY: spring(0, [200, 20])
        };

        return {
            defaultStyle: closedStyle,
            style: (this.state.opened) ? openedStyle : closedStyle
        }
    },

    render() {
        var animation = this.getAnimationStyles();

        return (
            <div className="drop-down">
                <div className="drop-down--current" onClick={this.getClickCallback(this.getSelectedIndex())}>
                    {this.props.items[this.getSelectedIndex()]}
                </div>
                <Motion defaultStyle={animation.defaultStyle} style={animation.style}>
                    {this.renderList}
                </Motion>
            </div>
        );
    },

    renderList({opacity, translateY}) {
        var style = { opacity: opacity, transform: `translateY(${translateY}px)`};

        return (
            <div className="drop-down--list-container" style={style}>
                <ul className="drop-down--list">
                    {this.props.items.map(this.renderItem)}
                </ul>
            </div>
        );
    },

    renderItem(item, index) {
        var render = null;

        if (index !== this.state.selectedIndex) {
            render = (
                <li className="drop-down--list-item" onClick={this.getClickCallback(index)}>
                    {item}
                </li>
            );
        }

        return render;
    },

    getClickCallback(index) {
        return callback(this.handleClick.bind(this, index), this.props.onChange, {index: index})
    },

    handleClick(index) {
        if (this.getSelectedIndex() === index) {
            this.setState({
                opened: !this.state.opened
            });
        }
        else {
            this.setState({
                selectedIndex: index
            });
        }
    },

    getSelectedIndex() {
        return (this.props.selectedIndex !== undefined) ? this.props.selectedIndex : this.state.selectedIndex;
    }
});

export default DropDown;