import _ from 'lodash';

import Reducer from 'reducers/reducer';

class ModalReducer extends Reducer {

    getInitialState() {
        return {
            opened: false,
            noPadding: false,
            content: null
        };
    }

    getTypeHandlers() {
        return {
            'OPEN_MODAL': this.onOpenModal,
            'CLOSE_MODAL': this.onCloseModal
        };
    }

    onOpenModal(state, payload) {
        document.body.setAttribute('style', 'overflow:hidden');

        return _.extend({}, state, {
            opened: true,
            content: payload.content,
            noPadding: payload.noPadding || false
        });
    }

    onCloseModal(state) {
        document.body.setAttribute('style', '');
        
        return _.extend({}, state, {
            opened: false,
            content: null,
            noPadding: false
        });
    }
}

export default ModalReducer.getInstance();