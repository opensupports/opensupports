import React from 'react';

import i18n from 'lib-app/i18n';

import Table from 'core-components/table';
import Button from 'core-components/button';
import Tooltip from 'core-components/tooltip';
import TicketInfo from 'app-components/ticket-info';

class TicketList extends React.Component {
    static propTypes = {
        tickets: React.PropTypes.arrayOf(React.PropTypes.object),
        type: React.PropTypes.oneOf([
            'primary',
            'secondary'
        ])
    };

    static defaultProps = {
        tickets: [],
        type: 'primary'
    };

    render() {
        return (
            <div className="ticket-list">
                <Table headers={this.getTableHeaders()} rows={this.getTableRows()} pageSize={10} />
            </div>
        );
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
        return this.props.tickets.map(this.gerTicketTableObject.bind(this));
    }

    gerTicketTableObject(ticket) {
        let titleText = (ticket.unread) ? ticket.title  + ' (1)' : ticket.title;

        return {
            number: (
                <Tooltip content={<TicketInfo ticket={ticket}/>} openOnHover>
                    {'#' + ticket.ticketNumber}
                </Tooltip>
            ),
            title: (
                <Button className="ticket-list__title-link" type="clean" route={{to: '/dashboard/ticket/' + ticket.ticketNumber}}>
                    {titleText}
                </Button>
            ),
            priority: this.getTicketPriority(ticket.priority),
            department: ticket.department.name,
            author: ticket.author.name,
            date: ticket.date,
            highlighted: ticket.unread
        };
    }
    getTicketPriority(priority){
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
}


export default TicketList;
