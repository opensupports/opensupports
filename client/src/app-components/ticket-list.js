import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';

import i18n from 'lib-app/i18n';
import DateTransformer from 'lib-core/date-transformer';

import TicketInfo from 'app-components/ticket-info';
import DepartmentDropdown from 'app-components/department-dropdown';
import Table from 'core-components/table';
import Button from 'core-components/button';
import Tooltip from 'core-components/tooltip';
import Checkbox from 'core-components/checkbox';
import Tag from 'core-components/tag';

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
    };

    static defaultProps = {
        showDepartmentDropdown: true,
        loading: false,
        tickets: [],
        departments: [],
        ticketPath: '/dashboard/ticket/',
        type: 'primary',
        closedTicketsShown: false
    };

    state = {
        selectedDepartment: 0
    };

    render() {
        return (
            <div className="ticket-list">
                <div className="ticket-list__filters">
                    {(this.props.type === 'secondary' && this.props.showDepartmentDropdown) ? this.renderDepartmentsDropDown() : null}
                    {this.props.onClosedTicketsShownChange ? this.renderFilterCheckbox() : null}
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

    getDepartmentDropdownProps() {
        return {
            departments: this.getDepartments(),
            onChange: (event) => {
                const departmentId = event.index && this.props.departments[event.index - 1].id;
                this.setState({
                    selectedDepartment: departmentId
                });
                if(this.props.onDepartmentChange) {
                    this.props.onDepartmentChange(departmentId || null);
                }
            },
            size: 'medium'
        };
    }

    getTableProps() {
        return {
            loading: this.props.loading,
            headers: this.getTableHeaders(),
            rows: this.getTableRows(),
            pageSize: 10,
            comp: this.compareFunction,
            page: this.props.page,
            pages: this.props.pages,
            onPageChange: this.props.onPageChange
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
        if (this.props.type  == 'primary' ) {
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
                    value: i18n('DATE'),
                    className: 'ticket-list__date col-md-2'
                }
            ];
        } else if (this.props.type == 'secondary') {
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
                    key: 'priority',
                    value: i18n('PRIORITY'),
                    className: 'ticket-list__priority col-md-1'
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
                    value: i18n('DATE'),
                    className: 'ticket-list__date col-md-2'
                }
            ];
        }
    }

    getTableRows() {
        return this.getTickets().map(this.gerTicketTableObject.bind(this));
    }

    getTickets() {
        return (this.state.selectedDepartment) ? _.filter(this.props.tickets, (ticket) => {
            return ticket.department.id == this.state.selectedDepartment
        }) : this.props.tickets;
    }

    gerTicketTableObject(ticket) {
        let titleText = (this.isTicketUnread(ticket)) ? ticket.title  + ' (1)' : ticket.title;

        return {
            number: (
                <Tooltip content={<TicketInfo ticket={ticket}/>} openOnHover>
                    {'#' + ticket.ticketNumber}
                </Tooltip>
            ),
            title: (
                <div>
                    <Button className="ticket-list__title-link" type="clean" route={{to: this.props.ticketPath + ticket.ticketNumber}}>
                        {titleText}
                    </Button>
                    {(ticket.tags || []).map((tagName,index) => {
                        let tag = _.find(this.props.tags, {name:tagName});
                        return <Tag size='small' name={tag && tag.name} color={tag && tag.color} key={index} />
                    })}
                </div>

            ),
            priority: this.getTicketPriority(ticket.priority),
            department: ticket.department.name,
            author: ticket.author.name,
            date: DateTransformer.transformToString(ticket.date, false),
            unread: this.isTicketUnread(ticket),
            highlighted: this.isTicketUnread(ticket)
        };
    }

    getTicketPriority(priority) {
        if(priority == 'high'){
            return (
                <span className="ticket-list__priority-high">{i18n('HIGH')}</span>
            );
        }
        if(priority == 'medium'){
            return (
                <span className="ticket-list__priority-medium">{i18n('MEDIUM')}</span>
            );
        }
        if(priority == 'low'){
            return (
                <span className="ticket-list__priority-low">{i18n('LOW')}</span>
            );
        }
    }

    compareFunction(row1, row2) {
        if (row1.closed == row2.closed) {
            if (row1.unread == row2.unread) {
                let s1 = row1.date;
                let s2 = row2.date;

                let y1 = s1.substring(0, 4);
                let y2 = s2.substring(0, 4);

                if (y1 == y2) {
                    let m1 = s1.substring(4, 6);
                    let m2 = s2.substring(4, 6);

                    if (m1 == m2) {
                        let d1 = s1.substring(6, 8);
                        let d2 = s2.substring(6, 8);

                        if (d1 == d2) {
                            return 0;
                        }
                        return d1 > d2 ? -1 : 1;
                    }
                    return m1 > m2 ? -1 : 1;
                }
                return y1 > y2 ? -1 : 1;
            }
            return row1.unread ? -1 : 1;
        }
        return row1.closed ? -1 : 1;
    }

    isTicketUnread(ticket) {
        if(this.props.type === 'primary') {
            return ticket.unread;
        } else if(this.props.type === 'secondary') {
              if(ticket.author.id == this.props.userId && ticket.author.staff) {
                  return ticket.unread;
              } else {
                  return ticket.unreadStaff;
              }
        }
    }
}

export default connect((store) => {
    return {
        tags: store.config['tags']
    };
})(TicketList);
