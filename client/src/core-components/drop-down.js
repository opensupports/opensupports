const React = require('react');
const classNames = require('classnames');
const _ = require('lodash');
const {Motion, spring} = require('react-motion');
const callback = require('lib-core/callback');

const Menu = require('core-components/menu');
const Icon = require('core-components/icon');

const DropDown = React.createClass({

    propTypes: {
        defaultSelectedIndex: React.PropTypes.number,
        selectedIndex: React.PropTypes.number,
        items: Menu.propTypes.items
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
        let selectedItem = this.props.items[this.getSelectedIndex()];

        return (
            <div className={this.getClass()}>
                {this.renderCurrentItem(selectedItem)}
                <Motion defaultStyle={animation.defaultStyle} style={animation.style}>
                    {this.renderList}
                </Motion>
            </div>
        );
    },

    renderList({opacity, translateY}) {
        let style = { opacity: opacity, transform: `translateY(${translateY}px)`};
        let menuProps = {
            items: this.props.items,
            onItemClick: this.handleItemClick,
            onMouseDown: this.handleListMouseDown
        };

        return (
            <div className="drop-down--list-container" style={style}>
                <Menu {...menuProps} />
            </div>
        );
    },

    renderCurrentItem(item) {
        var iconNode = null;

        if (item.icon) {
            iconNode = <Icon className="drop-down--current-item-icon" name={item.icon} />;
        }

        return (
            <div className="drop-down--current-item" onBlur={this.handleBlur} onClick={this.handleClick} tabIndex="0">
                {iconNode}{item.content}
            </div>
        );
    },

    getClass() {
        let classes = {
            'drop-down': true,
            'drop-down_closed': !this.state.opened,

            [this.props.className]: (this.props.className)
        };

        return classNames(classes);
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

    handleListMouseDown(event) {
        event.preventDefault();
    },

    getSelectedIndex() {
        return (this.props.selectedIndex !== undefined) ? this.props.selectedIndex : this.state.selectedIndex;
    }
});

export default DropDown;
