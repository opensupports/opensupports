
export default {
    openModal(content) {
        return {
            type: 'OPEN_MODAL',
            payload: content
        }
    },

    closeModal() {
        return {
            type: 'CLOSE_MODAL',
            payload: {}
        };
    }
};