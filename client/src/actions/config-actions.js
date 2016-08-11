export default {
    changeLanguage(newLanguage) {
        return {
            type: 'CHANGE_LANGUAGE',
            payload: newLanguage
        };
    }
};