import React              from 'react';
import classNames         from 'classnames';

import {Motion, spring}   from 'react-motion';
import Icon               from 'core-components/icon';

class Message extends React.Component {

    static propTypes = {
        title: React.PropTypes.string,
        children: React.PropTypes.node,
        leftAligned: React.PropTypes.bool,
        onCloseMessage: React.PropTypes.func,
        type: React.PropTypes.oneOf(['success', 'error', 'info', 'warning'])
    };

    static defaultProps = {
        type: 'info',
        leftAligned: false,
        showCloseButton: true,
        showMessage: true
    };

    render() {
        return (
            this.props.showMessage ?
                <Motion {...this.getAnimationProps()}>
                    {this.renderMessage.bind(this)}
                </Motion> :
                null
        );
    }

    getAnimationProps() {
        return {
            defaultStyle: {
                opacity: 0
            },
            style: {
                opacity: spring(1, [100, 30])
            }
        };
    }

    renderMessage(style) {
        return this.renderMessageContent(style);
    }

    renderMessageContent(style) {
        const { children, title, showCloseButton } = this.props;

        return (
            <div className={this.getClass()} style={style} aria-live="assertive">
                <Icon className="message__icon" name={this.getIconName()} size={this.getIconSize()} />
                <div className="message__title">{title}</div>
                <div className="message__content">{children}</div>
                {showCloseButton ? this.renderCloseButton() : null}
            </div>
        )
    }

    getClass() {
        const { type, title, leftAligned, className } = this.props

        let classes = {
            'message': true,
            'message_success': (type === 'success'),
            'message_error': (type === 'error'),
            'message_info': (type === 'info'),
            'message_warning': (type === 'warning'),
            'message_with-title': title,
            'message_left-aligned': leftAligned,

            [className]: className
        };

        return classNames(classes);
    }

    getIconName() {
        let iconNames = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'info': 'info-circle',
            'warning': 'exclamation-triangle'
        };

        return iconNames[this.props.type];
    }

    getIconSize() {
        return (this.props.title) ? '2x' : 'lg';
    }

    renderCloseButton() {
        return (
            <span className="message__close-icon" onClick={this.onCloseMessage.bind(this)}>
                <Icon name="times" size="1x"/>
            </span>
        );
    }

    onCloseMessage() {
        const { onCloseMessage } = this.props

        onCloseMessage && onCloseMessage();
    }
}

export default Message;
