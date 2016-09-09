import React from 'react';

class Modal extends React.Component {
    static propTypes = {
        content: React.PropTypes.node
    };

    render() {
        return (
            <div className="modal">
                <div className="modal__content">
                    {this.props.content}
                </div>
            </div>
        );
    }
}

export default Modal;