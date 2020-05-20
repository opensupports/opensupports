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

    initFiltersFromParams(dispatch) {
        const search = window.location.search;
        let filters = queryString.parse(window.location.search);
        filters = {
            ...filters,
            closed: filters.closed ? filters.closed*1 : undefined,
            priority: filters.priority ? filters.priority*1 : undefined,
        }
        const custom = window.customTicketList[queryString.parse(search).custom*1]; 
        if(search) {
            if(filters.authors) {
                this.getAuthorsFromAPI(filters.authors).then((authors) => {
                    dispatch(searchFiltersActions.changeFilters({
                        title: custom.title,
                        filters: {
                            ...custom.filters,
                            ...filters,
                            authors: JSON.stringify(authors),
                        },
                        preventHistoryChange: true,
                    }));
                });  
            } else {
                dispatch(searchFiltersActions.changeFilters({filters, preventHistoryChange: true}));
            }
        }
    }
}