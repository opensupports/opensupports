import API from 'lib-app/api-call';
import searchTicketsUtils from 'lib-app/search-tickets-utils';
import history from 'lib-app/history';

export default {
    setLoadingInTrue() {
        return {
            type: 'SEARCH_FILTERS_SET_LOADING_IN_TRUE',
            payload: {}
        }
    },
    retrieveSearchTickets(ticketQueryListState, filters = {}, pageSize = 10) {
        return {
            type: 'SEARCH_TICKETS',
            payload: API.call({
                path: '/ticket/search',
                data: {
                    ...filters,
                    page: ticketQueryListState.page,
                    pageSize
                }
            })
        }
    },
    changeForm(form) {
        return {
            type: 'SEARCH_FILTERS_CHANGE_FORM',
            payload: form
        }
    },
    changeFilters(listConfig) {
        const filtersForAPI = searchTicketsUtils.getFiltersForAPI(listConfig.filters);

        return {
            type: 'SEARCH_FILTERS_CHANGE_FILTERS',
            payload: {...listConfig, filtersForAPI}
        }
    },
    setDefaultFormValues() {
        return {
            type: 'SEARCH_FILTERS_SET_DEFAULT_FORM_VALUES',
            payload: {}
        }
    },
    changeShowFilters(showFilters) {
        return {
            type: 'SEARCH_FILTERS_CHANGE_SHOW_FILTERS',
            payload: showFilters
        }
    },
    changePage(filtersWithPage) {
        const filtersForAPI = searchTicketsUtils.getFiltersForAPI(filtersWithPage);
        const currentPath = window.location.pathname;
        const urlQuery = searchTicketsUtils.getFiltersForURL({
            filters: filtersForAPI,
            shouldRemoveCustomParam: false,
            shouldRemoveUseInitialValuesParam: true
        });
        urlQuery && history.push(`${currentPath}${urlQuery}`);

        return {
            type: 'SEARCH_FILTERS_CHANGE_PAGE',
            payload: {...filtersWithPage, ...filtersForAPI}
        }
    },
    changeOrderBy(filtersWithOrderBy) {
        const filtersForAPI = searchTicketsUtils.getFiltersForAPI(filtersWithOrderBy);
        const currentPath = window.location.pathname;
        const urlQuery = searchTicketsUtils.getFiltersForURL({
            filters: filtersForAPI,
            shouldRemoveCustomParam: false,
            shouldRemoveUseInitialValuesParam: true
        });
        urlQuery && history.push(`${currentPath}${urlQuery}`);

        return {
            type: 'SEARCH_FILTERS_CHANGE_ORDER_BY',
            payload: {...filtersWithOrderBy, ...filtersForAPI}
        }
    },
};
