import React from 'react';

import i18n from 'lib-app/i18n';
import ModalContainer from 'app-components/modal-container';

import Button from 'core-components/button';
import Icon from 'core-components/icon';
import Message from 'core-components/message';


class PopupMessage extends React.Component {
    static propTypes = Message.propTypes;

    static contextTypes = {
        closeModal: React.PropTypes.func
    };

    static open(props) {
        ModalContainer.openModal(
            <PopupMessage {...props}/>,
            true,
            true
        );
    }

    componentDidMount() {
        this.refs.closeButton && this.refs.closeButton.focus();
    }

    render() {
        return (
            <div className="popup-message">
                <Message {...this.props} className="popup-message__message"/>
                <Button className="popup-message__close-button" iconName="times" type="clean" ref="closeButton" onClick={this.closeModal.bind(this)}/>
            </div>
        );
    }

    closeModal() {
        if (this.context.closeModal) {
            this.context.closeModal();
        }
    }
}

export default PopupMessage;