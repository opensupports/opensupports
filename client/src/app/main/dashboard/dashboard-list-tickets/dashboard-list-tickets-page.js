import React from 'react';
import {connect} from 'react-redux';

import Table from 'core-components/table';
import Button from 'core-components/button';

class DashboardListTicketsPage extends React.Component {
    static propTypes = {
        tickets: React.PropTypes.arrayOf(React.PropTypes.object)
    };

    static defaultProps = {
        tickets: []
    };

    render() {
        return (
            <div className="dashboard-ticket-list">
                <div className="dashboard-ticket-list__header">Tickets</div>
                <Table headers={this.getTableHeaders()} rows={this.getTableRows()} />
            </div>
        );
    }

    getTableHeaders() {
        return [
            {
                key: 'number',
                value: 'Number',
                className: 'dashboard-ticket-list__number col-md-1'
            },
            {
                key: 'title',
                value: 'Title',
                className: 'dashboard-ticket-list__title col-md-6'
            },
            {
                key: 'department',
                value: 'Department',
                className: 'dashboard-ticket-list__department col-md-3'
            },
            {
                key: 'date',
                value: 'Date',
                className: 'dashboard-ticket-list__date col-md-2'
            }
        ];
    }

    getTableRows() {
        return this.props.tickets.map(this.gerTicketTableObject.bind(this));
    }

    gerTicketTableObject(ticket) {
        let titleText = (ticket.unread) ? ticket.title  + ' (1)' : ticket.title;

        return {
            number: '#' + ticket.ticketNumber,
            title: (
                <Button className="dashboard-ticket-list__title-link" type="clean" route={{to: '/dashboard/ticket/' + ticket.ticketNumber}}>
                    {titleText}
                </Button>
            ),
            department: ticket.department.name,
            date: ticket.date,
            highlighted: ticket.unread
        };
    }
}


export default connect((store) => {
    return {
        tickets: store.session.userTickets
    };
})(DashboardListTicketsPage);
