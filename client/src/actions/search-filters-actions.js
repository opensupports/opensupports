import API from 'lib-app/api-call';
import searchTicketsUtils from 'lib-app/search-tickets-utils';
import history from 'lib-app/history';

export default {
    retrieveSearchTickets(ticketQueryListState, filters = {}) {
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
    submitListConfig(listConfig) {
        const filtersForAPI = searchTicketsUtils.prepareFiltersForAPI(listConfig.filters);
        const currentPath = history.getCurrentLocation().pathname;
        const urlQuery = searchTicketsUtils.getFiltersForURL(filtersForAPI, true);
        urlQuery && history.push(`${currentPath}${urlQuery}`);

        return {
            type: 'SEARCH_FILTERS_ON_SUBMIT_LIST_CONFIG',
            payload: listConfig,
        }
    },
    changeForm(form) {
        return {
            type: 'SEARCH_FILTERS_CHANGE_FORM',
            payload: form,
        }
    },
    changeFilters(listConfig) {
        const filtersForAPI = searchTicketsUtils.prepareFiltersForAPI(listConfig.filters);
        const currentPath = history.getCurrentLocation().pathname;
        const urlQuery = searchTicketsUtils.getFiltersForURL(filtersForAPI, false);
        urlQuery && history.push(`${currentPath}${urlQuery}`);

        return {
            type: 'SEARCH_FILTERS_CHANGE_FILTERS',
            payload: {...listConfig, filtersForAPI},
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
    changePage(listConfigWithPage) {
        const filtersForAPI = searchTicketsUtils.prepareFiltersForAPI(listConfigWithPage.filters);
        const currentPath = history.getCurrentLocation().pathname;
        const urlQuery = searchTicketsUtils.getFiltersForURL(filtersForAPI, false);
        urlQuery && history.push(`${currentPath}${urlQuery}`);

        return {
            type: 'SEARCH_FILTERS_CHANGE_PAGE',
            payload: {...listConfigWithPage, filtersForAPI},
        }
    },
};
