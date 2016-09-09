import React from 'react';

import {Motion, spring} from 'react-motion';

class Modal extends React.Component {
    static propTypes = {
        content: React.PropTypes.node
    };

    render() {
        return (
            <div className="modal">
                <Motion {...this.getAnimations()}>
                    {this.renderContent.bind(this)}
                </Motion>
            </div>
        );
    }

    getAnimations() {
        return {
            defaultStyle: {
                scale: spring(0.7),
                fade: spring(0)
            },
            style: {
                scale: spring(1),
                fade: spring(1)
            }
        }
    }

    renderContent(animation) {
        const style = {
            transform: 'scale(' + animation.scale + ')',
            opacity: animation.fade
        };

        return (
            <div className="modal__content" style={style}>
                {this.props.content}
            </div>
        )
    }
}

export default Modal;