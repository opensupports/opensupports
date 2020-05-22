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
  filters = {...queryString.parse(window.location.search), ...filters};
  
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
            listData: this.getList(),
            form: {
                query: '',
                closed: 0,
                priority: 0,
                departments: [],
                owners: [],
                tags: [],
                authors: [],
                dateRange: {valid: true, startDate: DEFAULT_START_DATE, endDate: DateTransformer.getDateToday()}
            }
        };
    }

    getTypeHandlers() {
        return {
            'SEARCH_FILTERS_CHANGE_FILTERS': this.onFiltersChange.bind(this),
            'SEARCH_FILTERS_CHANGE_FORM': this.onFormChange,
            'SEARCH_FILTERS_CHANGE_SHOW_FILTERS': this.onChangeShowFilters.bind(this),
            'SEARCH_FILTERS_SET_DEFAULT_FORM_VALUES': this.onSetDefaultFormValues.bind(this),
            'SEARCH_FILTERS_ON_SUBMIT_FORM': this.onSubmitForm.bind(this),
            'SEARCH_FILTERS_CHANGE_CUSTOM_LIST_FILTERS': this.onCustomListFiltersChange.bind(this),
        };
    }

    onFiltersChange(state, payload, submited = false) {
        const authorsListFilters = payload.filters.authors ? JSON.parse(payload.filters.authors) : undefined;
        const filtersWithCorrectAuthorsList = (
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
          let filters = payload.filters ? filtersWithCorrectAuthorsList : payload;
          setFiltersInURL(filters);
        }

        return _.extend({}, state, {
            listData: {
                title: payload.title ? payload.title : undefined,
                filters: payload.filters ?
                    _.extend(
                        {},
                        DEFAULT_FILTERS,
                        filtersWithCorrectAuthorsList
                    ) :
                    payload
            },
            form: submited ? state.form :  this.transformToFormValue({...DEFAULT_FILTERS, ...payload.filters})
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
                this.onSubmitForm(state, this.transformToFormValue(DEFAULT_FILTERS))
            )
        );
    }

    onSubmitForm(state, payload) {
        return this.onFiltersChange(_.extend({}, state, {form: payload}), this.formValueToFilters(payload), true);
    }

    onCustomListFiltersChange(state, payload) {
        const customTicketListFilters = payload;
        const customTicketListdateRangeFilter = customTicketListFilters.filters.dateRange;
        const newFiltersWithDefaultDateRange = {
            title: customTicketListFilters.title,
            filters: {
                ...customTicketListFilters.filters,
                dateRange: customTicketListdateRangeFilter ? customTicketListdateRangeFilter : getDefaultDateRangeForFilters()
            }
        }

        return (
            payload ?
                this.onFiltersChange(state, newFiltersWithDefaultDateRange) :
                {
                    ...state,
                    listData: {
                        title: undefined,
                        filters: DEFAULT_FILTERS
                    },
                    form: this.transformToFormValue(DEFAULT_FILTERS)
                }
        );
    }

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

    getList() {
        let custom = undefined;
        if(store) {
            custom = store.getState().routing.locationBeforeTransitions.query.custom;
        }
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
    }

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
    }


    formValueToFilters(form) {
        const authors = form.authors ? form.authors.map(author => ({id: author.id*1, isStaff: author.isStaff})) : [];
        const dateRangeFilter = [form.dateRange.startDate, form.dateRange.endDate];
        const newFiltersValues = {
            ...form,
            query: form.query !== '' ? form.query : undefined,
            closed: this.getTicketStatusByDropdownIndex(form.closed),
            priority: this.getTicketPrioritiesByDropdownIndex(form.priority),
            departments: form.departments !== undefined ? JSON.stringify(form.departments) : '[]',
            owners: JSON.stringify(form.owners),
            tags: JSON.stringify(form.tags),
            dateRange: JSON.stringify(DateTransformer.formDateRangeToFilters(dateRangeFilter)),
            authors: JSON.stringify(authors),
        };

        return {
            ...this.getList(),
            filters: newFiltersValues
        };
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
            authors: filters.authors ? JSON.parse(filters.authors) : []
        };
    }
}
export default searchFiltersReducer.getInstance();
