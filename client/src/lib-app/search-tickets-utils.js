import queryString from 'query-string';
import _ from 'lodash';

import DateTransformer from 'lib-core/date-transformer';
import API from 'lib-app/api-call';

const DEFAULT_UTC_START_DATE = 201701010000;

const TICKET_STATUSES = {
    ANY: undefined,
    OPENED: 0,
    CLOSED: 1
};

const CLOSED_DROPDOWN_INDEXES = {
    ANY: 0,
    OPENED: 1,
    CLOSED: 2
}

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
    getFiltersFromParams(search = window.location.search) {
        let urlFilters = queryString.parse(search);
        delete urlFilters.page;
        const customTicketsList = urlFilters.custom && window.customTicketList && window.customTicketList[urlFilters.custom*1];
        const customTicketsListFilters = customTicketsList && customTicketsList.filters;

        if(customTicketsListFilters) {
            const newFilters = {
                ...customTicketsListFilters,
                ...urlFilters
            };
            if(newFilters.authors) {
                return this.getAuthorsFromAPI(newFilters.authors).then((authors) => {
                    return {
                        title: customTicketsList ? customTicketsList.title : undefined,
                        filters: {
                            ...newFilters,
                            authors: JSON.stringify(authors),
                        }
                    };
                });
            } else {
                return new Promise(resolve => resolve({
                    title: customTicketsList ? customTicketsList.title : undefined,
                    filters: newFilters
                }));
            }
        } else {
            if(urlFilters.authors) {
                return this.getAuthorsFromAPI(urlFilters.authors).then((authors) => {
                    return {
                        filters: {
                            ...urlFilters,
                            authors: JSON.stringify(authors),
                        }
                    };
                });
            } else {
                return new Promise(resolve => resolve({filters: urlFilters}));
            }
        }
    },
    prepareFiltersForAPI(filters){
        const authorsListFilters = (filters && filters.authors) ? JSON.parse(filters.authors) : undefined;
        let filtersForAPI = (
            (authorsListFilters && authorsListFilters.length && authorsListFilters[0].name) ?
                {
                    ...filters,
                    authors: JSON.stringify(
                        authorsListFilters.map(author => ({id: author.id*1, isStaff: author.isStaff}))
                    )
                } :
                filters
        );
        const dateRange = filtersForAPI.dateRange;

        if(filtersForAPI && filtersForAPI.closed !== undefined) {
            filtersForAPI = {
                ...filtersForAPI,
                closed: filtersForAPI.closed*1
            }
        }

        filtersForAPI = {
            ...filtersForAPI,
            dateRange: dateRange ? dateRange : this.getDefaultUTCRange()
        }

        return filtersForAPI ? filtersForAPI : {};
    },
    getFiltersForURL(filtersWithShouldRemoveParams) {
        const shouldRemoveCustomParam = filtersWithShouldRemoveParams.shouldRemoveCustomParam ? filtersWithShouldRemoveParams.shouldRemoveCustomParam : false;
        const shouldRemoveUseInitialValuesParam = filtersWithShouldRemoveParams.shouldRemoveUseInitialValuesParam ? filtersWithShouldRemoveParams.shouldRemoveUseInitialValuesParam : false;
        const currentSearchParams = queryString.parse(window.location.search);
        let filters = {
            ...currentSearchParams,
            ...filtersWithShouldRemoveParams.filters,
        };

        filters = {
            ...filters,
            query: filters.query ? encodeURIComponent(filters.query) : filters.query
        };

        if(shouldRemoveCustomParam) delete filters.custom;
        if(shouldRemoveUseInitialValuesParam) delete filters.useInitialValues;

        filters = (filters.custom !== undefined) ?
            {
                custom: filters.custom,
                orderBy: filters.orderBy,
                page: (filters.page !== undefined) ? filters.page : undefined
            } :
            filters;

        const query = Object.keys(filters).reduce(function (query, filter) {
            const value = filters[filter];
            if (value === undefined || value === null || value === '' || value === '[]') return query;
            else if(typeof value == 'string') return query + `&${filter}=${value}`;
            else return query + `&${filter}=${JSON.stringify(value)}`;
        }, '').slice(1);

        if(!_.isEqual(queryString.parse(`?${query}`), currentSearchParams)) {
            return `?${query}`;
        }
    },
    getClosedDropdowIndex(status) {
        let closedDropdownIndex;

        switch(status) {
            case TICKET_STATUSES.CLOSED:
                closedDropdownIndex = CLOSED_DROPDOWN_INDEXES.CLOSED;
                break;
            case TICKET_STATUSES.OPENED:
                closedDropdownIndex = CLOSED_DROPDOWN_INDEXES.OPENED;
                break;
            default:
                closedDropdownIndex = CLOSED_DROPDOWN_INDEXES.ANY;
        }

        return closedDropdownIndex;
    },
    transformToFormValue(filters) {
        const localDateRange = DateTransformer.rangeTransformer(JSON.parse(filters.dateRange), "UTCToLocal");
        const newDateRange = {
            valid: true,
            startDate: localDateRange[0],
            endDate: localDateRange[1],
        };

        return {
            ...filters,
            query: filters.query ? filters.query : '',
            closed: this.getClosedDropdowIndex(filters.closed*1),
            departments: JSON.parse(filters.departments),
            owners: JSON.parse(filters.owners),
            tags: JSON.parse(filters.tags),
            dateRange: newDateRange,
            authors: filters.authors ? JSON.parse(filters.authors) : [],
        };
    },
    getTicketStatusByDropdownIndex(dropdownIndex) {
        let status;

        switch(dropdownIndex) {
            case CLOSED_DROPDOWN_INDEXES.CLOSED:
                status = TICKET_STATUSES.CLOSED;
                break;
            case CLOSED_DROPDOWN_INDEXES.OPENED:
                status = TICKET_STATUSES.OPENED;
                break;
            default:
                status = TICKET_STATUSES.ANY;
        }

        return status;
    },
    formValueToListConfig(form, hasAllAuthorsInfo = false) {
        const authors = form.authors ? form.authors.map(author => ({id: author.id*1, isStaff: author.isStaff})) : [];
        const localRange = [form.dateRange.startDate, form.dateRange.endDate];

        return {
            filters: {
                ...form,
                query: form.query !== '' ? form.query : undefined,
                closed: this.getTicketStatusByDropdownIndex(form.closed),
                departments: form.departments !== undefined ? JSON.stringify(form.departments) : '[]',
                owners: JSON.stringify(form.owners),
                tags: JSON.stringify(form.tags),
                dateRange: JSON.stringify(DateTransformer.rangeTransformer(localRange, "localToUTC")),
                authors: JSON.stringify(authors),
            },
            hasAllAuthorsInfo
        };
    },
    getDefaultUTCRange() {
        return JSON.stringify([DEFAULT_UTC_START_DATE, this.getDefaultUTCEndDate()]);
    },
    getDefaultUTCStartDate() {
        return DEFAULT_UTC_START_DATE
    },
    getDefaultUTCEndDate() {
        return DateTransformer.localDateToUTCNumericDate(JSON.stringify((DateTransformer.getDateToday()*10000)+2359));
    },
    getDefaultLocalStartDate() {
        return DateTransformer.UTCDateToLocalNumericDate(this.getDefaultUTCStartDate())
    },
    getDefaultlocalEndDate() {
        return DateTransformer.UTCDateToLocalNumericDate(this.getDefaultUTCEndDate())
    }
}
