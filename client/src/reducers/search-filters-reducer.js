import _ from 'lodash';

import { LOCATION_CHANGE } from 'react-router-redux'
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
    departments: "[]",
    owners: "[]",
    tags: "[]",
    dateRange: getDefaultDateRangeForFilters(),
    orderBy: undefined,
};

function getDefaultDateRangeForFilters() {
    return JSON.stringify(DateTransformer.formDateRangeToFilters([20170101, DateTransformer.getDateToday()]));
}

const DEFAULT_START_DATE = 20170101;

class searchFiltersReducer extends Reducer {
    
    getInitialState() {
        return {
            showFilters: false,
            listData: this.getList(),
            form: {
                query: "",
                closed: 0,
                priority: 0,
                departments: [],
                owners: [],
                tags: [],
                dateRange: {valid: true, startDate: DEFAULT_START_DATE, endDate: DateTransformer.getDateToday()},    
            }
        };
    }

    getTypeHandlers() {
        return {
            'ON_SUBMIT_FORM': this.onSubmitForm.bind(this),
            'CHANGE_FORM': this.onFormChange,
            'CHANGE_FILTERS': this.onFiltersChange.bind(this),
            'SET_DEFAULT_FORM_VALUES': this.onSetDefaultFormValues.bind(this),
            'CHANGE_SHOW_FILTERS': this.onChangeShowFilters.bind(this),
            [LOCATION_CHANGE]: this.onUrlChange.bind(this),
        };
    }

    dateRangeToFormValue(_dateRange) {
        const dateRange = JSON.parse(_dateRange);

        return {
            valid: true,
            startDate: dateRange[0]/10000,
            endDate: (dateRange[1]-2400)/10000,
        };
    }

    formValueToFilters(form) {
        let dateRangeFilter = [form.dateRange.startDate, form.dateRange.endDate];
        let newFiltersValues = {
            ...form,
            query: form.query !== "" ? form.query : undefined,
            closed: this.getTicketStatusByDropdownIndex(form.closed),
            priority: this.getTicketPrioritiesByDropdownIndex(form.priority),
            departments: form.departments !== undefined ? JSON.stringify(form.departments) : "[]",
            owners: JSON.stringify(form.owners),
            tags: JSON.stringify(form.tags),
            dateRange: JSON.stringify(DateTransformer.formDateRangeToFilters(dateRangeFilter)),
        };

        return {
            ...this.getList(),
            filters: newFiltersValues
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

    onFiltersChange(state, payload) {
        return _.extend({}, state, {
            listData: {
                title: payload.title ? payload.title : undefined,
                filters: payload.filters ? _.extend({}, DEFAULT_FILTERS, payload.filters) : payload
            },
            form: this.transformToFormValue({...DEFAULT_FILTERS, ...payload.filters})
        });
    }

    onFormChange(state, payload) {
        return _.extend({}, state, {
            form: payload,
        });
    }

    onSetDefaultFormValues(state) {
        let custom = store.getState().routing.locationBeforeTransitions.query.custom;
        let customDefaultFilters = custom ? window.customTicketList[custom*1].filters : undefined;

        return _.extend({}, state, {form: this.transformToFormValue({...DEFAULT_FILTERS, ...customDefaultFilters})});
    }

    onChangeShowFilters(state, payload) {
        return _.extend({}, state, {showFilters: !payload});
    }

    onSubmitForm(state, payload) {
        return this.onFiltersChange(state, this.formValueToFilters(payload));
    }

    onUrlChange(state, payload) {
        return (
            payload.query.custom ?
                this.onFiltersChange(state, window.customTicketList[payload.query.custom*1]) :
                ({
                    listData: {
                        title: undefined,
                        filters: DEFAULT_FILTERS
                    },
                    form: this.transformToFormValue(DEFAULT_FILTERS)
                })
        );
    }

    transformToFormValue(filters) {
        let newFormValues = {
            ...newFormValues,
            query: filters.query ? filters.query : "",
            closed: this.getClosedDropdowIndex(filters.closed),
            priority: this.getPriorityDropdownIndex(filters.priority),
            departments: JSON.parse(filters.departments),
            owners: JSON.parse(filters.owners),
            tags: JSON.parse(filters.tags),
            dateRange: this.dateRangeToFormValue(filters.dateRange),
        }

        return newFormValues;
    }
}
export default searchFiltersReducer.getInstance();
