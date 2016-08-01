import React              from 'react';
import classNames         from 'classnames';

import {Motion, spring}   from 'react-motion';
import Icon               from 'core-components/icon';

const Message = React.createClass({

    propTypes: {
        title: React.PropTypes.string,
        children: React.PropTypes.node,
        type: React.PropTypes.oneOf(['success', 'error', 'info'])
    },

    getDefaultProps() {
        return {
            type: 'info'
        };
    },

    render() {
        return (
            <Motion {...this.getAnimationProps()}>
                {this.renderMessage}
            </Motion>
        );
    },

    getAnimationProps() {
        return {
            defaultStyle: {
                opacity: spring(0, [100, 30])
            },
            style: {
                opacity: spring(1, [100, 30])
            }
        };
    },

    renderMessage(style) {
        return (
            <div className={this.getClass()} style={style} aria-live="assertive">
                <Icon className="message__icon" name={this.getIconName()} size={this.getIconSize()} />
                <div className="message__title">{this.props.title}</div>
                <div className="message__content">{this.props.children}</div>
            </div>
        )
    },

    getClass() {
        let classes = {
            'message': true,
            'message_success': (this.props.type === 'success'),
            'message_error': (this.props.type === 'error'),
            'message_info': (this.props.type === 'info'),
            'message_with-title': (this.props.title),

            [this.props.className]: (this.props.className)
        };

        return classNames(classes);
    },

    getIconName() {
        let iconNames = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'info': 'info-circle'
        };

        return iconNames[this.props.type];
    },

    getIconSize() {
        return (this.props.title) ? '2x' : 'lg';
    }
});

export default Message;
