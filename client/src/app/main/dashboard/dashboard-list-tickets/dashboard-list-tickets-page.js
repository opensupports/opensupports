import React from 'react';
import Table from 'core-components/table';
import Button from 'core-components/button';

let mockTickets = [
    {
        ticketNumber: '445441',
        title: 'Problem with installation',
        content: 'I had a problem with the installation of the php server',
        department: 'Environment Setup',
        date: '15 Apr 2016',
        file: 'http://www.opensupports.com/some_file.zip',
        language: 'en',
        unread: true,
        closed: false,
        author: {
            name: 'John Smith',
            email: 'john@smith.com'
        },
        owner: {
            name: 'Steve Jobs'
        },
        comments: [
            {
                content: 'Do you have apache installed? It generally happens if you dont have apache.',
                author: {
                    name: 'Steve Jobs',
                    email: 'jobs@steve.com',
                    staff: true
                }
            },
            {
                content: 'I have already installed apache, but the problem persists',
                author: {
                    name: 'John Smith',
                    steve: 'john@smith.com',
                    staff: false
                }
            }
        ]
    },
    {
        ticketNumber: '87852',
        title: 'Lorem ipsum door',
        content: 'I had a problem with the installation of the php server',
        department: 'Environment Setup',
        date: '15 Apr 2016',
        file: 'http://www.opensupports.com/some_file.zip',
        language: 'en',
        unread: false,
        closed: false,
        author: {
            name: 'John Smith',
            email: 'john@smith.com'
        },
        owner: {
            name: 'Steve Jobs'
        },
        comments: [
            {
                content: 'Do you have apache installed? It generally happens if you dont have apache.',
                author: {
                    name: 'Steve Jobs',
                    email: 'jobs@steve.com',
                    staff: true
                }
            },
            {
                content: 'I have already installed apache, but the problem persists',
                author: {
                    name: 'John Smith',
                    steve: 'john@smith.com',
                    staff: false
                }
            }
        ]
    }
];


class DashboardListTicketsPage extends React.Component {
    static propTypes = {
        tickets: React.PropTypes.arrayOf(React.PropTypes.object)
    };

    static defaultProps = {
        tickets: mockTickets.concat([mockTickets[1], mockTickets[1]])
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
            department: ticket.department,
            date: ticket.date,
            highlighted: ticket.unread
        };
    }
}

export default DashboardListTicketsPage;
