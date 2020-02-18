export default {
    submitForm(form) {
        return {
            type: 'ON_SUBMIT_FORM',
            payload: form,
        }
    },
    changeForm(form) {
        return {
            type: 'CHANGE_FORM',
            payload: form,
        }
    },
    changeFilters(filters) {
        return {
            type: 'CHANGE_FILTERS',
            payload: filters,
        }
    },
};
