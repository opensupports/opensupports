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
            formEdited: false,
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
        };
    }

    onSearchTicketsRetrieved(state, payload) {
        const page = payload.data.page;
        searchTicketsUtils.setFiltersInURL({page: page});
        return (
            _.extend(
                {},
                state,
                {ticketQueryListState: {
                    ...state.ticketQueryListState,
                    tickets: payload.data.tickets,
                    page: page,
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
        const filtersForAPI = searchTicketsUtils.prepareFiltersForAPI(payload.filters);

        if(!payload.preventHistoryChange) {
            searchTicketsUtils.setFiltersInURL(filtersForAPI, !payload.title);
        }

        return _.extend({}, state, {
            listConfig: {
                title: payload.title ? payload.title : undefined,
                filters: payload.filters ?
                    _.extend(
                        {},
                        DEFAULT_FILTERS,
                        filtersForAPI
                    ) :
                    DEFAULT_FILTERS
            },
            formEdited: false,
            showFilters: !payload.title,
            form: payload.hasAllAuthorsInfo ?
                state.form :
                searchTicketsUtils.transformToFormValue({...DEFAULT_FILTERS, ...payload.filters})
        });
    }

    onFormChange(state, payload) {
        return _.extend({}, state, {
            form: payload,
            formEdited: true,
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
                {
                    form: searchTicketsUtils.transformToFormValue(DEFAULT_FILTERS),
                    formEdited: true,
                },
            )
        );
    }

    onSubmitForm(state, payload) {
        let customList = {
            ...this.getListConfig(),
            ...payload,
            title: null,
        };

        return this.onFiltersChange(state, customList);
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
