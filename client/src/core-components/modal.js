import React from 'react';
import classNames from 'classnames';

import {Motion, spring} from 'react-motion';

import Icon from 'core-components/icon';

class Modal extends React.Component {
    static propTypes = {
        content: React.PropTypes.node,
        noPadding: React.PropTypes.bool,
        outsideClick: React.PropTypes.bool,
        onOutsideClick: React.PropTypes.func,
        showCloseButton: React.PropTypes.bool
    };

    render() {
        return (
            <Motion {...this.getAnimations()}>
                {this.renderModal.bind(this)}
            </Motion>
        );
    }

    getAnimations() {
        return {
            defaultStyle: {
                scale: 0.7,
                fade: 0.5
            },
            style: {
                scale: spring(1),
                fade: spring(1)
            }
        }
    }

    renderModal(animation) {
        const {
            showCloseButton,
            content
        } = this.props;

        return (
            <div className={this.getClass()} style={{opacity: animation.fade}} onClick={this.onModalClick.bind(this)}>
                <div className="modal__content" style={{transform: 'scale(' + animation.scale + ')'}} onClick={this.onModalContentClick.bind(this)}>
                    {showCloseButton ? this.renderCloseButton() : null}
                    {content}
                </div>
            </div>
        )
    }

    renderCloseButton() {
        return (
            <span className="modal__close-icon" onClick={() => this.props.onOutsideClick()}>
                <Icon name="times" size="2x"/>
            </span>
        );
    }

    getClass() {
        let classes = {
            'modal': true,
            'modal_no-padding': this.props.noPadding
        };

        return classNames(classes);
    }

    onModalClick() {
        const {
            outsideClick,
            onOutsideClick
        } = this.props;

        outsideClick && onOutsideClick();
    }

    onModalContentClick(event) {
        this.props.outsideClick && event.stopPropagation();
    }
}

export default Modal;
