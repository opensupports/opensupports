import queryString from 'query-string';
import searchFiltersActions from '../actions/search-filters-actions';

import API from 'lib-app/api-call';
import DateTransformer from 'lib-core/date-transformer';


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

const TICKET_PRIORITIES = {
    ANY: undefined,
    LOW: [0],
    MEDIUM: [1],
    HIGH: [2]
};

const PRIORITIES_DROPDOWN_INDEXES = {
    ANY: 0,
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3
};

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
        const urlFilters = queryString.parse(search);
        const customTicketsList = window.customTicketList[urlFilters.custom*1];
        const customTicketsListFilters = customTicketsList ? customTicketsList.filters : undefined;

        if(customTicketsListFilters) {
            if(customTicketsListFilters.authors) {
                return this.getAuthorsFromAPI(customTicketsListFilters.authors).then((authors) => {
                    return {
                        title: customTicketsList ? customTicketsList.title : undefined,
                        filters: {
                            ...customTicketsListFilters,
                            ...urlFilters,
                            authors: JSON.stringify(authors),
                        },
                    };
                });
            } else {
                return new Promise(resolve => resolve({
                    title: customTicketsList ? customTicketsList.title : undefined,
                    filters: {
                        ...customTicketsListFilters,
                        ...urlFilters,
                    },
                }));
            }
        } else {
            return new Promise(resolve => resolve({
                filters: urlFilters
            }));
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
    getPriorityDropdownIndex(_priority) {
        let priorityDorpDownIndex = PRIORITIES_DROPDOWN_INDEXES.ANY;

        if(_priority !== undefined) {
            let priority = JSON.parse(_priority)[0];
            switch(priority) {
                case TICKET_PRIORITIES.LOW[0]:
                    priorityDorpDownIndex = PRIORITIES_DROPDOWN_INDEXES.LOW;
                    break;
                case TICKET_PRIORITIES.MEDIUM[0]:
                    priorityDorpDownIndex = PRIORITIES_DROPDOWN_INDEXES.MEDIUM;
                    break;
                case TICKET_PRIORITIES.HIGH[0]:
                    priorityDorpDownIndex = PRIORITIES_DROPDOWN_INDEXES.HIGH;
                    break;
            }
        }

        return priorityDorpDownIndex;
    },
    transformToFormValue(filters) {
        return {
            ...filters,
            query: filters.query ? filters.query : '',
            closed: this.getClosedDropdowIndex(filters.closed),
            priority: this.getPriorityDropdownIndex(filters.priority),
            departments: JSON.parse(filters.departments),
            owners: JSON.parse(filters.owners),
            tags: JSON.parse(filters.tags),
            dateRange: DateTransformer.dateRangeToFormValue(filters.dateRange),
            authors: filters.authors ? JSON.parse(filters.authors) : [],
        };
    },
    getTicketPrioritiesByDropdownIndex(dropdownIndex) {
        let priorities = TICKET_PRIORITIES.ANY;

        switch(dropdownIndex) {
            case PRIORITIES_DROPDOWN_INDEXES.LOW:
                priorities = TICKET_PRIORITIES.LOW;
                break;
            case PRIORITIES_DROPDOWN_INDEXES.MEDIUM:
                priorities = TICKET_PRIORITIES.MEDIUM;
                break;
            case PRIORITIES_DROPDOWN_INDEXES.HIGH:
                priorities = TICKET_PRIORITIES.HIGH;
                break;
        }

        return priorities !== undefined ? JSON.stringify(priorities) : priorities;
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
    formValueToFilters(form, hasAllAuthorsInfo = false) {
        const authors = form.authors ? form.authors.map(author => ({id: author.id*1, isStaff: author.isStaff})) : [];
        const dateRangeFilter = [form.dateRange.startDate, form.dateRange.endDate];

        return {
            filters: {
                ...form,
                query: form.query !== '' ? form.query : undefined,
                closed: this.getTicketStatusByDropdownIndex(form.closed),
                priority: this.getTicketPrioritiesByDropdownIndex(form.priority),
                departments: form.departments !== undefined ? JSON.stringify(form.departments) : '[]',
                owners: JSON.stringify(form.owners),
                tags: JSON.stringify(form.tags),
                dateRange: JSON.stringify(DateTransformer.formDateRangeToFilters(dateRangeFilter)),
                authors: JSON.stringify(authors),
            },
            hasAllAuthorsInfo
        };
    }

}