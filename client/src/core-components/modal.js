import React from 'react';
import classNames from 'classnames';

import {Motion, spring} from 'react-motion';

class Modal extends React.Component {
    static propTypes = {
        content: React.PropTypes.node,
        noPadding: React.PropTypes.bool
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
        return (
            <div className={this.getClass()} style={{opacity: animation.fade}}>
                <div className="modal__content" style={{transform: 'scale(' + animation.scale + ')'}}>
                    {this.props.content}
                </div>
            </div>
        )
    }

    getClass() {
        let classes = {
            'modal': true,
            'modal_no-padding': this.props.noPadding
        };

        return classNames(classes);
    }
}

export default Modal;