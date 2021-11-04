import React from 'react';

import ModalContainer from 'app-components/modal-container';

import Button from 'core-components/button';
import Message from 'core-components/message';


class PopupMessage extends React.Component {
    static propTypes = Message.propTypes;

    static contextTypes = {
        closeModal: React.PropTypes.func
    };

    static open(props) {
        ModalContainer.openModal(
            <PopupMessage {...props} />,
            {noPadding: true, outsideClick: true, closeButton: {showCloseButton: false, whiteColor: false}}
        );
    }

    componentDidMount() {
        this.refs.closeButton && this.refs.closeButton.focus();
    }

    render() {
        return (
            <div className="popup-message">
                <Message {...this.props} showCloseButton={false} className="popup-message__message" />
                <Button
                    className="popup-message__close-button"
                    iconName="times"
                    type="clean"
                    ref="closeButton"
                    onClick={this.closeModal.bind(this)} />
            </div>
        );
    }

    closeModal() {
        const { closeModal } = this.context;

        closeModal && closeModal();
    }
}

export default PopupMessage;
