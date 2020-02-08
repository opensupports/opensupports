import React from 'react';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';

import TicketQueryList from 'app-components/ticket-query-list';

import Header from 'core-components/header';
import Message from 'core-components/message';
import
    TicketQueryFilters,
    {
        TICKET_STATUSES,
        CLOSED_DROPDOWN_INDEXES,
        TICKET_PRIORITIES,
        PRIORITIES_DROPDOWN_INDEXES
    } from 'app-components/ticket-query-filters';
import dateTransformer from '../../../../lib-core/date-transformer';

class AdminPanelSearchTickets extends React.Component {

    state = {
        listData: this.getList(),
    }

    render() {
        return (
            <div className="admin-panel-all-tickets">
                <Header title={this.getList().title} description={i18n('SEARCH_TICKETS_DESCRIPTION')} />
                <TicketQueryFilters
                    filters={this.state.listData.filters}
                    onSubmit={filters => this.onSubmit(filters)} />
                {
                    (this.props.error) ?
                        <Message type="error">{i18n('ERROR_RETRIEVING_TICKETS')}</Message> :
                        <TicketQueryList
                            filters={this.state.listData.filters}
                            onChangeOrderBy={this.onChangeOrderBy.bind(this)} />
                }
            </div>
        );
    }

    getList() {
        const defaultFilters = {
            query: "",
            closed: undefined,
            priority: undefined,
            departments: "[]",
            owners: "[]",
            tags: "[]",
            dateRange: this.getDefaultDateRange(),
            orderBy: undefined,
        };

        if (
            window.customTicketList && 
            this.props.location.query.custom && 
            window.customTicketList[this.props.location.query.custom*1]
        ){ 
            return {
                title: window.customTicketList[this.props.location.query.custom*1].title,
                filters: {
                    ...defaultFilters,
                    ...window.customTicketList[this.props.location.query.custom*1].filters,
                }
            };
        } else {
            return {
                'title': i18n('CUSTOM_LIST'),
                'filters': defaultFilters,
            };
        }
    }

    getDefaultDateRange() {
        return JSON.stringify(this.formDateRangeToFilters([20170101, dateTransformer.getDateToday()]));
    }

    onSubmit(filter) {
        this.setState({
            listData: {
                ...this.state.listData,
                filters: this.formValueToFilters(filter),
            }
        });
    }

    formValueToFilters(form) {
        let newFormValues = {
            query: form.query,
            closed: this.getTicketStatusByDropdownIndex(form.closed),
            priority: this.getTicketPrioritiesByDropdownIndex(form.priority),
            departments: JSON.stringify(form.departments),
            owners: JSON.stringify(form.owners),
            tags: JSON.stringify(form.tags),
            dateRange: JSON.stringify(this.formDateRangeToFilters([form.dateRange.startDate, form.dateRange.endDate])),
            orderBy: form.orderBy !== undefined ? JSON.stringify(form.orderBy) : undefined,
        };

        return newFormValues;
    }

    formDateRangeToFilters(dateRange) {
        return [dateRange[0]*10000, dateRange[1]*10000+2400];
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

    onChangeOrderBy(value) {
        const { listData, } = this.state;
        let orderBy = listData.filters.orderBy ? JSON.parse(listData.filters.orderBy) : {value: ""};
        let newOrderBy = {};
        let newAsc = 0;
        let newValue = value;

        if(value === orderBy.value) {
            newAsc = orderBy.asc === 0 ? 1 : 0;
        }

        newOrderBy = JSON.stringify({"value": newValue, "asc": newAsc});

        this.setState({
            listData: {
                ...this.state.listDate,
                filters: {...this.state.listData.filters, orderBy: newOrderBy}
            }
        });
    }
}

export default connect((store) => {
    return {
        error: store.adminData.allTicketsError
    };
})(AdminPanelSearchTickets);
