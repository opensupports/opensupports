import queryString from 'query-string';
import searchFiltersActions from '../actions/search-filters-actions';

import API from 'lib-app/api-call';

export default {
    getAuthorsFromAPI(authors = '') {
        return API.call({
            path: '/ticket/get-authors',
            data: {
                authors,
            }
        }).then(r => {
            return r.data.map((author) => ({...author, isStaff: author.isStaff * 1}));
        });
    },

    initFiltersFromParams(dispatch, search = window.location.search) {
        let filters = queryString.parse(search);
        const customTicketsList = window.customTicketList[filters.custom*1];
        const customTicketsListFilters = customTicketsList ? customTicketsList.filters : undefined;

        if(customTicketsListFilters && customTicketsListFilters.authors) {
            this.getAuthorsFromAPI(customTicketsListFilters.authors).then((authors) => {
                dispatch(searchFiltersActions.changeFilters({
                    title: customTicketsList ? customTicketsList.title : undefined,
                    filters: {
                        ...customTicketsListFilters,
                        ...filters,
                        authors: JSON.stringify(authors),
                    },
                }));
            });
        } else {
            dispatch(searchFiltersActions.changeFilters({filters}));
        }
    }
}