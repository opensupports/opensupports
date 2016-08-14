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
            'Number',
            'Title',
            'Department',
            'Date'
        ];
    }

    getTableRows() {
        return [
            [
                '#445441',
                'Problem with installation',
                'Environment Setup',
                '15 Apr 2016'
            ],
            [
                '#445441',
                'Problem with installation',
                'Environment Setup',
                '15 Apr 2016'
            ],
            [
                '#445441',
                'Problem with installation',
                'Environment Setup',
                '15 Apr 2016'
            ],
            [
                '#445441',
                'Problem with installation',
                'Environment Setup',
                '15 Apr 2016'
            ],
            [
                '#445441',
                'Problem with installation',
                'Environment Setup',
                '15 Apr 2016'
            ]
        ];
    }
}

export default DashboardListTicketsPage;
