
export default {
    showLoginForm() {
        return {
            type: 'SHOW_LOGIN_FORM',
            payload: true
        };
    },
    hideLoginForm() {
        return {
            type: 'HIDE_LOGIN_FORM',
            payload: false
        };
    }
};
