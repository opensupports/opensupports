import _ from 'lodash';

import Reducer from 'reducers/reducer';

class ModalReducer extends Reducer {

    getInitialState() {
        return {
            opened: false,
            content: null,
            options: {
                noPadding: false,
                outsideClick: false,
                closeButton: {
                    showCloseButton: false,
                    whiteColor: false
                }
            }
        };
    }

    getTypeHandlers() {
        return {
            'OPEN_MODAL': this.onOpenModal,
            'CLOSE_MODAL': this.onCloseModal
        };
    }

    onOpenModal(state, payload) {
        const { content, options } = payload;
        const { noPadding, outsideClick, closeButton } = options;

        document.body.setAttribute('style', 'overflow:hidden');

        return _.extend({}, state, {
            opened: true,
            content,
            options: {
                noPadding: noPadding || false,
                outsideClick,
                closeButton
            }
        });
    }

    onCloseModal(state) {
        document.body.setAttribute('style', '');
        
        return _.extend({}, state, {
            opened: false,
            content: null,
            options: {
                noPadding: false,
                outsideClick: false,
                closeButton: {
                    showCloseButton: false,
                    whiteColor: false
                }
            }
        });
    }
}

export default ModalReducer.getInstance();
