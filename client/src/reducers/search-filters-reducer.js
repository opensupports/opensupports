import _ from 'lodash';
import queryString from 'query-string';

import Reducer from 'reducers/reducer';

import DateTransformer from 'lib-core/date-transformer';
import searchTicketsUtils from '../lib-app/search-tickets-utils';

const DEFAULT_START_DATE = 20170101;

const DEFAULT_FILTERS = {
    query: undefined,
    closed: undefined,
    priority: undefined,
    departments: '[]',
    owners: '[]',
    tags: '[]',
    dateRange: searchTicketsUtils.getDefaultDateRangeForFilters(),
    orderBy: undefined,
    authors: '[]',
};

function setFiltersInURL(filters) {
  filters = {
    ...queryString.parse(window.location.search),
    ...filters,
  };

  const query = Object.keys(filters).reduce(function (query, filter) {
    const value = filters[filter];
    if (value === undefined || value === null || value === '' || value === '[]') return query;
    else if(typeof value == 'string') return query + `&${filter}=${value}`;
    else return query + `&${filter}=${JSON.stringify(value)}`;
  }, '').slice(1);
  history.pushState(null, '', `?${query}`);
}


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
            },
            isPreviousPathnameSearchTickets: true,
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
            'SEARCH_FILTERS_ON_CHANGE_IS_PREVIOUS_PATHNAME_SEARCH_TICKETS': this.onChangeIsPreviousPathnameSearchTickets.bind(this),
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
        const filtesForAPI = searchTicketsUtils.prepareFiltersForAPI(payload.filters);

        if(!payload.preventHistoryChange) {
          setFiltersInURL(filtesForAPI);
        }

        return _.extend({}, state, {
            listConfig: {
                title: payload.title ? payload.title : undefined,
                filters: payload.filters ?
                    _.extend(
                        {},
                        DEFAULT_FILTERS,
                        filtesForAPI
                    ) :
                    DEFAULT_FILTERS
            },
            form: payload.hasAllAuthorsInfo ?
                state.form :
                searchTicketsUtils.transformToFormValue({...DEFAULT_FILTERS, ...payload.filters})
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
                {form: searchTicketsUtils.transformToFormValue(DEFAULT_FILTERS)},
            )
        );
    }

    onSubmitForm(state, payload) {
        return this.onFiltersChange(state, {...this.getListConfig(), ...payload});
    }

    onChangeIsPreviousPathnameSearchTickets(state, payload) {
        return _.extend({}, state, {isPreviousPathnameSearchTickets: payload});
    }

    getListConfig() {
        const custom = queryString.parse(window.location.search).custom;
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
}
export default searchFiltersReducer.getInstance();
