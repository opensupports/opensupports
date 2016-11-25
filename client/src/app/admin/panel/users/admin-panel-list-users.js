import React from 'react';

import i18n from 'lib-app/i18n';
import Header from 'core-components/header';
import Table from 'core-components/table';

class AdminPanelListUsers extends React.Component {

    render() {
        return (
            <div>
                <Header title={i18n('LIST_USERS')} description={i18n('LIST_USERS_DESCRIPTION')} />
                <Table {...this.getTableProps()} />
            </div>
        );
    }

    getTableProps() {
        return {
            loading: this.props.loading,
            headers: this.getTableHeaders(),
            rows: this.getTableRows(),
            pageSize: 10,
            page: this.props.page,
            pages: this.props.pages,
            onPageChange: this.props.onPageChange
        };
    }

    getTableHeaders() {
        return [
            {
                key: 'name',
                value: i18n('NAME'),
                className: 'ticket-list__number col-md-3'
            },
            {
                key: 'email',
                value: i18n('EMAIL'),
                className: 'col-md-5'
            },
            {
                key: 'tickets',
                value: i18n('TICKETS'),
                className: 'col-md-2'
            },
            {
                key: 'date',
                value: i18n('SIGNUP_DATE'),
                className: 'col-md-2'
            }
        ];
    }

    getTableRows() {
        return [
            
        ];
    }
}

export default AdminPanelListUsers;