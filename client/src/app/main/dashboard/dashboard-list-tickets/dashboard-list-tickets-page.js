import React from 'react';
import Table from 'core-components/table';

class DashboardListTicketsPage extends React.Component {

    render() {
        return (
            <div>
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
                className: 'dashboard-ticket-list__title col-md-7'
            },
            {
                key: 'department',
                value: 'Department',
                className: 'dashboard-ticket-list__department col-md-2'
            },
            {
                key: 'date',
                value: 'Date',
                className: 'dashboard-ticket-list__date col-md-2'
            }
        ];
    }

    getTableRows() {
        return [
            {
                number: '#445441',
                title: 'Problem with installation',
                department: 'Environment Setup',
                date: '15 Apr 2016'
            },
            {
                number: '#445441',
                title: 'Problem with installation',
                department: 'Environment Setup',
                date: '15 Apr 2016'
            },
            {
                number: '#445441',
                title: 'Problem with installation',
                department: 'Environment Setup',
                date: '15 Apr 2016'
            },
            {
                number: '#445441',
                title: 'Problem with installation',
                department: 'Environment Setup',
                date: '15 Apr 2016'
            },
            {
                number: '#445441',
                title: 'Problem with installation',
                department: 'Environment Setup',
                date: '15 Apr 2016'
            },
            {
                number: '#445441',
                title: 'Problem with installation',
                department: 'Environment Setup',
                date: '15 Apr 2016'
            }
        ];
    }
}

export default DashboardListTicketsPage;
