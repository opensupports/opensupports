import React from 'react';

import {Motion, spring} from 'react-motion';

class Modal extends React.Component {
    static propTypes = {
        content: React.PropTypes.node
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
            <div className="modal" style={{opacity: animation.fade}}>
                <div className="modal__content" style={{transform: 'scale(' + animation.scale + ')'}}>
                    {this.props.content}
                </div>
            </div>
        )
    }
}

export default Modal;