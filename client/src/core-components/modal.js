import React from 'react';
import classNames from 'classnames';

import {Motion, spring} from 'react-motion';

import Icon from 'core-components/icon';

const closeButtonSchema = React.PropTypes.shape({
    showCloseButton: React.PropTypes.bool,
    whiteColor: React.PropTypes.bool
});

class Modal extends React.Component {
    static propTypes = {
        content: React.PropTypes.node,
        noPadding: React.PropTypes.bool,
        outsideClick: React.PropTypes.bool,
        onOutsideClick: React.PropTypes.func,
        closeButton: closeButtonSchema
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
        const { closeButton, content } = this.props;
        const { showCloseButton, whiteColor } = closeButton;

        return (
            <div className={this.getClass()} style={{opacity: animation.fade}} onClick={this.onModalClick.bind(this)}>
                <div className="modal__content" style={{transform: 'scale(' + animation.scale + ')'}} onClick={this.onModalContentClick.bind(this)}>
                    {showCloseButton ? this.renderCloseButton(whiteColor) : null}
                    {content}
                </div>
            </div>
        )
    }

    renderCloseButton(whiteColor = false) {
        return (
            <span className={`modal__close-icon${whiteColor ? " modal__close-icon__white-color" : ""}`} onClick={() => this.props.onOutsideClick()}>
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
