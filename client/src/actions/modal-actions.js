
export default {
    openModal(config) {
        return {
            type: 'OPEN_MODAL',
            payload: config
        }
    },

    closeModal() {
        return {
            type: 'CLOSE_MODAL',
            payload: {}
        };
    }
};