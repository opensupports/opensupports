import API from 'lib-app/api-call';

export default {
    retrieveSearchTickets(ticketQueryListState, filters = undefined) {
        return {
            type: 'SEARCH_TICKETS',
            payload: API.call({
                path: '/ticket/search',
                data: {
                     ...filters,
                    page: ticketQueryListState.page
                }
            })
        }
    },
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
    // changeCustomListFilters(customListIndex){
    //     return {
    //         type: 'SEARCH_FILTERS_CHANGE_CUSTOM_LIST_FILTERS',
    //         payload: customListIndex,
    //     }
    // },
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
