import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import queryString from 'query-string';

import i18n from 'lib-app/i18n';
import DateTransformer from 'lib-core/date-transformer';

import TicketInfo from 'app-components/ticket-info';
import DepartmentDropdown from 'app-components/department-dropdown';
import Table from 'core-components/table';
import Button from 'core-components/button';
import Tooltip from 'core-components/tooltip';
import Checkbox from 'core-components/checkbox';
import Tag from 'core-components/tag';
import Icon from 'core-components/icon';
import Message from 'core-components/message';
import history from 'lib-app/history';
import PageSizeDropdown from './page-size-dropdown';

class TicketList extends React.Component {
    static propTypes = {
        departments: React.PropTypes.array,
        loading: React.PropTypes.bool,
        ticketPath: React.PropTypes.string,
        showDepartmentDropdown: React.PropTypes.bool,
        tickets: React.PropTypes.arrayOf(React.PropTypes.object),
        userId: React.PropTypes.number,
        type: React.PropTypes.oneOf([
            'primary',
            'secondary'
        ]),
        closedTicketsShown: React.PropTypes.bool,
        onClosedTicketsShownChange: React.PropTypes.func,
        onDepartmentChange: React.PropTypes.func,
        showPageSizeDropdown: React.PropTypes.bool
    };

    static defaultProps = {
        showDepartmentDropdown: true,
        loading: false,
        tickets: [],
        departments: [],
        ticketPath: '/dashboard/ticket/',
        type: 'primary',
        closedTicketsShown: false,
        showPageSizeDropdown: true
    };

    state = {
        selectedDepartment: 0
    };

    render() {
        const { type, showDepartmentDropdown, onClosedTicketsShownChange, showPageSizeDropdown } = this.props;
        const pages = [5, 10, 20, 50];

        return (
            <div className="ticket-list">
                <div className="ticket-list__filters">
                   <div className="ticket-list__main-filters">
                        {(type === 'primary') ? this.renderMessage() : null}
                        {
                            ((type === 'secondary') && showDepartmentDropdown) ?
                                this.renderDepartmentsDropDown() :
                                null
                        }
                        {onClosedTicketsShownChange ? this.renderFilterCheckbox() : null}
                   </div>
                   {
                        showPageSizeDropdown ?
                            <PageSizeDropdown className="ticket-list__page-dropdown" pages={pages} onChange={(event) => this.pageSizeChange(event)} /> : 
                            null
                    }
                </div>
                <Table {...this.getTableProps()} />
            </div>
        );
    }

    renderFilterCheckbox() {
        return (
            <Checkbox
                className="ticket-list__checkbox"
                label={i18n("SHOW_CLOSED_TICKETS")}
                value={this.props.closedTicketsShown}
                onChange={this.props.onClosedTicketsShownChange}
                wrapInLabel
            />
        );
    }

    renderDepartmentsDropDown() {
        return (
            <div className="ticket-list__department-selector">
                <DepartmentDropdown {...this.getDepartmentDropdownProps()} />
            </div>
        );
    }

    renderMessage() {
        switch (queryString.parse(window.location.search)["message"]) {
            case 'success':
                return (
                    <Message
                        onCloseMessage={this.onCloseMessage}
                        className="create-ticket-form__message"
                        type="success">
                            {i18n('TICKET_SENT')}
                    </Message>
                );
            case 'fail':
                return (
                    <Message
                        onCloseMessage={this.onCloseMessage}
                        className="create-ticket-form__message"
                        type="error">
                            {i18n('TICKET_SENT_ERROR')}
                    </Message>
                );
            default:
                return null;
        }
    }

    pageSizeChange(event) {
        const { onPageSizeChange } = this.props;

        onPageSizeChange && onPageSizeChange(event.pageSize);
    }

    getDepartmentDropdownProps() {
        const { departments, onDepartmentChange } = this.props;

        return {
            departments: this.getDepartments(),
            onChange: (event) => {
                const departmentId = event.index && departments[event.index - 1].id;

                this.setState({
                    selectedDepartment: departmentId
                });

                onDepartmentChange && onDepartmentChange(departmentId || null);
            },
            size: 'medium'
        };
    }

    getTableProps() {
        const { loading, page, pages, onPageChange } = this.props;

        return {
            loading,
            headers: this.getTableHeaders(),
            rows: this.getTableRows(),
            pageSize: this.state.tickets,
            page,
            pages,
            onPageChange
        };
    }

    getDepartments() {
        let departments = _.clone(this.props.departments);

        departments.unshift({
            name: i18n('ALL_DEPARTMENTS')
        });

        return departments;
    }

    getTableHeaders() {
        const { type } = this.props;

        if(type == 'primary' ) {
            return [
                {
                    key: 'number',
                    value: i18n('NUMBER'),
                    className: 'ticket-list__number col-md-1'
                },
                {
                    key: 'title',
                    value: i18n('TITLE'),
                    className: 'ticket-list__title col-md-6'
                },
                {
                    key: 'department',
                    value: i18n('DEPARTMENT'),
                    className: 'ticket-list__department col-md-3'
                },
                {
                    key: 'date',
                    value:  <div>
                                {i18n('DATE')}
                                {this.renderSortArrow('date')}
                            </div>,
                    className: 'ticket-list__date col-md-2'
                }
            ];
        } else if(type == 'secondary') {
            return [
                {
                    key: 'number',
                    value: i18n('NUMBER'),
                    className: 'ticket-list__number col-md-1'
                },
                {
                    key: 'title',
                    value: i18n('TITLE'),
                    className: 'ticket-list__title col-md-4'
                },
                {
                    key: 'department',
                    value: i18n('DEPARTMENT'),
                    className: 'ticket-list__department col-md-2'
                },
                {
                    key: 'author',
                    value: i18n('AUTHOR'),
                    className: 'ticket-list__author col-md-2'
                },
                {
                    key: 'date',
                    value:  <div>
                                {i18n('DATE')}
                                {this.renderSortArrow('date')}
                            </div>,
                    className: 'ticket-list__date col-md-2'
                }
            ];
        }
    }

    renderSortArrow(header) {
        const { orderBy, showOrderArrows, onChangeOrderBy } = this.props;

        return (
            showOrderArrows ?
                <Icon
                    name={`arrow-${this.getIconName(header, orderBy)}`}
                    className="ticket-list__order-icon"
                    color={this.getIconColor(header, orderBy)}
                    onClick={() => onChangeOrderBy(header)} /> :
                null
        );
    }

    getIconName(header, orderBy) {
        return (orderBy && orderBy.value === header && orderBy.asc) ? "up" : "down";
    }

    getIconColor(header, orderBy) {
        return (orderBy && orderBy.value === header) ? "gray" : "white";
    }

    getTableRows() {
        return this.getTickets().map(this.getTicketTableObject.bind(this));
    }

    getTickets() {
        const { tickets } = this.props;
        const { selectedDepartment } = this.state;

        return (
            (selectedDepartment) ?
                _.filter(tickets, (ticket) => { return ticket.department.id == selectedDepartment}) :
                tickets
        );
    }

    getTicketTableObject(ticket) {
        const { date, title, ticketNumber, closed, tags, department, author } = ticket;
        const dateTodayWithOutHoursAndMinutes = DateTransformer.getDateToday();
        const ticketDateWithOutHoursAndMinutes = Math.floor(DateTransformer.UTCDateToLocalNumericDate(JSON.stringify(date*1)) / 10000);
        const stringTicketLocalDateFormat = DateTransformer.transformToString(date, false, true);
        const ticketDate = (
            ((dateTodayWithOutHoursAndMinutes - ticketDateWithOutHoursAndMinutes) > 1) ?
                stringTicketLocalDateFormat :
                `${(dateTodayWithOutHoursAndMinutes - ticketDateWithOutHoursAndMinutes) ? i18n("YESTERDAY_AT") : i18n("TODAY_AT")} ${stringTicketLocalDateFormat.slice(-5)}`
        );
        let titleText = (this.isTicketUnread(ticket)) ? title + ' (1)' : title;

        return {
            number: (
                <Tooltip content={<TicketInfo ticket={ticket} />} openOnHover>
                    {'#' + ticketNumber}
                </Tooltip>
            ),
            title: (
                <div>
                    {closed ? <Icon size="sm" name="lock" /> : null}
                    <Button className="ticket-list__title-link" type="clean" route={{to: this.props.ticketPath + ticketNumber}}>
                        {titleText}
                    </Button>
                    {(tags || []).map((tagName,index) => {
                        let tag = _.find(this.props.tags, {name:tagName});
                        return <Tag size='small' name={tag && tag.name} color={tag && tag.color} key={index} />
                    })}
                </div>

            ),
            department: department.name,
            author: author.name,
            date: ticketDate,
            unread: this.isTicketUnread(ticket),
            highlighted: this.isTicketUnread(ticket)
        };
    }

    isTicketUnread(ticket) {
        const { type, userId } = this.props;
        const { unread, author, unreadStaff } = ticket;

        if(type === 'primary') {
            return unread;
        } else if(type === 'secondary') {
            if(author.id == userId && author.staff) {
                return unread;
            } else {
                return unreadStaff;
            }
        }
    }

    onCloseMessage() {
        history.push(window.location.pathname);
    }
}

export default connect((store) => {
    return {
        tags: store.config['tags']
    };
})(TicketList);
