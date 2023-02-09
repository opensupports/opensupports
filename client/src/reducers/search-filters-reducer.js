import _ from 'lodash';
import queryString from 'query-string';

import Reducer from 'reducers/reducer';

import searchTicketsUtils from '../lib-app/search-tickets-utils';

const DEFAULT_FILTERS = {
    query: undefined,
    closed: undefined,
    departments: '[]',
    owners: '[]',
    tags: '[]',
    orderBy: undefined,
    authors: '[]',
};


class searchFiltersReducer extends Reducer {
    
    getInitialState() {
        return {
            showFilters: !this.getListConfig().title,
            listConfig: this.getListConfig(),
            form: {
                query: '',
                closed: 0,
                departments: [],
                owners: [],
                tags: [],
                authors: [],
                period: 0
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
            'SEARCH_TICKETS_FULFILLED': this.onSearchTicketsRetrieved,
            'SEARCH_TICKETS_REJECTED': this.onSearchTicketsRejected,
            'SEARCH_TICKETS_PENDING': this.onSearchTicketsPending,

            'SEARCH_FILTERS_CHANGE_FORM': this.onFormChange,
            'SEARCH_FILTERS_SET_DEFAULT_FORM_VALUES': this.onSetDefaultFormValues,

            'SEARCH_FILTERS_CHANGE_FILTERS': this.onFiltersChange,

            'SEARCH_FILTERS_CHANGE_PAGE': this.onPageChange,
            'SEARCH_FILTERS_CHANGE_ORDER_BY': this.onOrderByChange,

            'SEARCH_FILTERS_CHANGE_SHOW_FILTERS': this.onChangeShowFilters,
            'SEARCH_FILTERS_SET_LOADING_IN_TRUE': this.onSetLoadingInTrue,
        };
    }

    onSearchTicketsRetrieved(state, payload) {
        const page = payload.data.page;
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

    onSetLoadingInTrue(state, payload) {
        return (
            _.extend(
                {},
                state,
                {
                    ticketQueryListState: {
                        ...state.ticketQueryListState,
                        loading: true
                    }
                }
            )
        )
    }

    onOrderByChange(state, payload) {
        return (
            _.extend(
                {},
                state,
                {
                    listConfig: {
                        ...state.listConfig,
                        filters: {
                            ...state.listConfig.filters,
                            orderBy: payload.orderBy,
                        }
                    },
                    formEdited: true,
                }
            )
        );
    }

    onPageChange(state, payload) {
        return (
            _.extend(
                {},
                state,
                {
                    ticketQueryListState: {
                        ...state.ticketQueryListState,
                        page: payload.page
                    },
                    formEdited: true,
                }
            )
        );
    }

    onFiltersChange(state, payload) {
        return _.extend({}, state, {
            listConfig: {
                title: payload.title ? payload.title : undefined,
                filters: payload.filters ?
                    _.extend(
                        {},
                        DEFAULT_FILTERS,
                        payload.filtersForAPI
                    ) :
                    DEFAULT_FILTERS
            },
            ticketQueryListState: {
                ...state.ticketQueryListState,
                loading: true
            },
            formEdited: state.ticketQueryListState.page !== 1,
            showFilters: state.showFilters,
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
        return _.extend({}, state, {showFilters: payload});
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
