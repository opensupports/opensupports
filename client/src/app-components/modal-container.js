import React              from 'react';
import { connect }        from 'react-redux';
import keyCode            from 'keycode';

import store from 'app/store';
import ModalActions from 'actions/modal-actions';
import Modal from 'core-components/modal';

class ModalContainer extends React.Component {

    static openModal(content, noPadding, outsideClick=false, showCloseButton=false) {
        store.dispatch(
            ModalActions.openModal({
                content,
                noPadding,
                outsideClick,
                showCloseButton
            })
        );
    }
    
    static closeModal() {
        store.dispatch(ModalActions.closeModal());
    }
    
    static childContextTypes = {
        closeModal: React.PropTypes.func
    };

    getChildContext() {
        return {
            closeModal: this.closeModal.bind(this)
        };
    };

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown.bind(this));
    }
    
    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown.bind(this));
    }

    render() {
        return (
            <div className="modal-container">
                {(this.props.modal.opened) ? this.renderModal() : null}
            </div>
        );
    }
    
    renderModal() {
        const {content, noPadding, outsideClick, showCloseButton} = this.props.modal;

        return (
            <Modal content={content} noPadding={noPadding} outsideClick={outsideClick} onOutsideClick={this.closeModal.bind(this)} showCloseButton={showCloseButton} />
        );
    }

    onKeyDown(event) {
        if (event.keyCode === keyCode('ESCAPE')) {
            this.closeModal();
        }
    }
    
    closeModal() {
        this.props.dispatch(ModalActions.closeModal());
    }
}

export default connect((store) => {
    return {
        modal: store.modal
    };
})(ModalContainer);
