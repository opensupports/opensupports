export default {
    submitForm(form) {
        return {
            type: 'SEARCH_FILTERS_ON_SUBMIT_FORM',
            payload: form,
        }
    },
    changeForm(form) {
        return {
            type: 'SEARCH_FILTERS_CHANGE_FORM',
            payload: form,
        }
    },
    changeFilters(filters) {
        return {
            type: 'SEARCH_FILTERS_CHANGE_FILTERS',
            payload: filters,
        }
    },
    changeCustomListFilters(customListIndex){
        return {
            type: 'SEARCH_FILTERS_CHANGE_CUSTOM_LIST_FILTERS',
            payload: customListIndex,
        }
    },
    setDefaultFormValues() {
        return {
            type: 'SEARCH_FILTERS_SET_DEFAULT_FORM_VALUES',
            payload: {},
        }
    },
    changeShowFilters(showFilters) {
        return {
            type: 'SEARCH_FILTERS_CHANGE_SHOW_FILTERS',
            payload: showFilters,
        }
    },
};
