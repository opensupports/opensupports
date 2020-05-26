import _ from 'lodash';
import queryString from 'query-string';

import Reducer from 'reducers/reducer';
import store from 'app/store';

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

const DEFAULT_FILTERS = {
    query: undefined,
    closed: undefined,
    priority: undefined,
    departments: '[]',
    owners: '[]',
    tags: '[]',
    dateRange: getDefaultDateRangeForFilters(),
    orderBy: undefined,
    authors: '[]',
};

function getDefaultDateRangeForFilters() {
    return JSON.stringify(DateTransformer.formDateRangeToFilters([20170101, DateTransformer.getDateToday()]));
}

function setFiltersInURL(filters) {
  filters = {
    ...queryString.parse(window.location.search),
    ...filters,
    dateRange: filters.dateRange ? filters.dateRange : getDefaultDateRangeForFilters()
  };
  
  const query = Object.keys(filters).reduce(function (query, filter) {
    const value = filters[filter];
    if (value === undefined || value === null || value === '' || value === '[]') return query;
    else if(typeof value == 'string') return query + `&${filter}=${value}`;
    else return query + `&${filter}=${JSON.stringify(value)}`;
  }, '').slice(1);
  history.pushState(null, '', `?${query}`);
}

const DEFAULT_START_DATE = 20170101;

class searchFiltersReducer extends Reducer {
    
    getInitialState() {
        return {
            showFilters: true,
            listConfig: this.getListConfig(),
            form: {
                query: '',
                closed: 0,
                priority: 0,
                departments: [],
                owners: [],
                tags: [],
                authors: [],
                dateRange: {valid: true, startDate: DEFAULT_START_DATE, endDate: DateTransformer.getDateToday()}
            },
            ticketQueryListState : {
                tickets: [],
                page: 1,
                pages: 0,
                error: null,
                loading: false
            }
        };
    }

    getTypeHandlers() {
        return {
            'SEARCH_TICKETS_FULFILLED': this.onSearchTicketsRetrieved.bind(this),
            'SEARCH_TICKETS_REJECTED': this.onSearchTicketsRejected.bind(this),
            'SEARCH_TICKETS_PENDING': this.onSearchTicketsPending.bind(this),

            'SEARCH_FILTERS_CHANGE_FILTERS': this.onFiltersChange.bind(this),
            'SEARCH_FILTERS_CHANGE_FORM': this.onFormChange,
            'SEARCH_FILTERS_CHANGE_SHOW_FILTERS': this.onChangeShowFilters.bind(this),
            'SEARCH_FILTERS_SET_DEFAULT_FORM_VALUES': this.onSetDefaultFormValues.bind(this),
            'SEARCH_FILTERS_ON_SUBMIT_FORM': this.onSubmitForm.bind(this),
            // 'SEARCH_FILTERS_CHANGE_CUSTOM_LIST_FILTERS': this.onCustomListFiltersChange.bind(this),
        };
    }

    onSearchTicketsRetrieved(state, payload) {
        return (
            _.extend(
                {},
                state,
                {ticketQueryListState: {
                    ...state.ticketQueryListState,
                    tickets: payload.data.tickets,
                    page: payload.data.page,
                    pages: payload.data.pages,
                    error: null,
                    loading: false
                }}
            )
        );
    }

    onSearchTicketsRejected(state, payload) {
        return (
            _.extend(
                {},
                state,
                {ticketQueryListState: {
                    ...state.ticketQueryListState,
                    error: payload.message,
                    loading: false
                }}
            )
        );
    }

    onSearchTicketsPending(state, payload) {
        return (
            _.extend(
                {},
                state,
                {ticketQueryListState: {
                    ...state.ticketQueryListState,
                    loading: true
                }}
            )
        );
    }

    onFiltersChange(state, payload) {
        const authorsListFilters = payload.filters.authors ? JSON.parse(payload.filters.authors) : undefined;
        const filtersWithCompleteAuthorsList = (
            (authorsListFilters && authorsListFilters.length && authorsListFilters[0].name) ?
                {
                    ...payload.filters,
                    authors: JSON.stringify(
                        authorsListFilters.map(author => ({id: author.id*1, isStaff: author.isStaff}))
                    )
                } :
                payload.filters
        );

        if(!payload.preventHistoryChange) {
          let filters = payload.filters ? filtersWithCompleteAuthorsList : payload;
          setFiltersInURL(filters);
        }

        return _.extend({}, state, {
            listData: {
                title: payload.title ? payload.title : undefined,
                filters: payload.filters ?
                    _.extend(
                        {},
                        DEFAULT_FILTERS,
                        filtersWithCompleteAuthorsList
                    ) :
                    payload
            },
            form: payload.hasAllAuthorsInfo ? state.form : this.transformToFormValue({...DEFAULT_FILTERS, ...payload.filters})
        });
    }

    onFormChange(state, payload) {
        return _.extend({}, state, {
            form: payload,
        });
    }

    onChangeShowFilters(state, payload) {
        return _.extend({}, state, {showFilters: !payload});
    }

    onSetDefaultFormValues(state) {
        return (
            _.extend(
                {},
                state,
                {form: this.transformToFormValue(DEFAULT_FILTERS)},
            )
        );
    }

    onSubmitForm(state, payload) {
        return this.onFiltersChange(state, {...this.getListConfig(), ...payload});
    }

    // onCustomListFiltersChange(state, payload) {
    //     if (payload) {
    //         const customTicketListFilters = payload;
    //         const customTicketListdateRangeFilter = customTicketListFilters.filters.dateRange;
    //         const newFiltersWithDefaultDateRange = {
    //             title: customTicketListFilters.title,
    //             filters: {
    //                 ...customTicketListFilters.filters,
    //                 dateRange: customTicketListdateRangeFilter ? customTicketListdateRangeFilter : getDefaultDateRangeForFilters()
    //             }
    //         }
    //         return this.onFiltersChange(state, newFiltersWithDefaultDateRange);
    //     } else {
    //         return {
    //             ...state,
    //             listData: {
    //                 title: undefined,
    //                 filters: DEFAULT_FILTERS
    //             },
    //             form: this.transformToFormValue(DEFAULT_FILTERS)
    //         }
    //     }
    // }

    dateRangeToFormValue(_dateRange) {
        const dateRange = JSON.parse(_dateRange);

        return {
            valid: true,
            startDate: dateRange[0]/10000,
            endDate: (dateRange[1]-2400)/10000,
        };
    }

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
    }

    getListConfig() {
        let custom = queryString.parse(window.location.search).custom;
        if(
            window.customTicketList &&
            custom &&
            window.customTicketList[custom*1]
        ){
            return {
                title: window.customTicketList[custom*1].title,
                filters: {
                    ...DEFAULT_FILTERS,
                    ...window.customTicketList[custom*1].filters,
                }
            };
        } else {
            return {
                'title': undefined,
                'filters': DEFAULT_FILTERS,
            };
        }
    }

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
    }

    transformToFormValue(filters) {
        return {
            ...filters,
            query: filters.query ? filters.query : '',
            closed: this.getClosedDropdowIndex(filters.closed),
            priority: this.getPriorityDropdownIndex(filters.priority),
            departments: JSON.parse(filters.departments),
            owners: JSON.parse(filters.owners),
            tags: JSON.parse(filters.tags),
            dateRange: this.dateRangeToFormValue(filters.dateRange),
            authors: filters.authors ? JSON.parse(filters.authors) : [],
        };
    }
}
export default searchFiltersReducer.getInstance();
