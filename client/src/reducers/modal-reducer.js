import _ from 'lodash';

import Reducer from 'reducers/reducer';

class ModalReducer extends Reducer {

    getInitialState() {
        return {
            opened: false,
            noPadding: false,
            content: null,
            outsideClick: false,
            showCloseButton: false
        };
    }

    getTypeHandlers() {
        return {
            'OPEN_MODAL': this.onOpenModal,
            'CLOSE_MODAL': this.onCloseModal
        };
    }

    onOpenModal(state, payload) {
        const {
            content,
            noPadding,
            outsideClick,
            showCloseButton
        } = payload;

        document.body.setAttribute('style', 'overflow:hidden');

        return _.extend({}, state, {
            opened: true,
            content,
            noPadding: noPadding || false,
            outsideClick,
            showCloseButton
        });
    }

    onCloseModal(state) {
        document.body.setAttribute('style', '');
        
        return _.extend({}, state, {
            opened: false,
            content: null,
            noPadding: false,
            outsideClick: false,
            showCloseButton: false
        });
    }
}

export default ModalReducer.getInstance();
