import React from 'react';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';
import DateTransformer from 'lib-core/date-transformer';

import Header from 'core-components/header';
import InfoTooltip from 'core-components/info-tooltip';
import Table from 'core-components/table';
import SearchBox from 'core-components/search-box';
import Button from 'core-components/button';
import Message from 'core-components/message';
import Icon from 'core-components/icon';
import ModalContainer from 'app-components/modal-container';
import MainSignUpWidget from 'app/main/main-signup/main-signup-widget';

class AdminPanelListUsers extends React.Component {

    state = {
        loading: true,
        users: [],
        orderBy: 'id',
        desc: true,
        error: false,
        page: 1,
        pages: 1
    };

    componentDidMount() {
        this.retrieveUsers({
            page: 1,
            orderBy: 'id',
            desc: true,
            search: ''
        });
    }

    render() {
        return (
            <div className="admin-panel-list-users">
                <Header title={i18n('LIST_USERS')} description={i18n('LIST_USERS_DESCRIPTION')} />
                <SearchBox className="admin-panel-list-users__search-box" placeholder={i18n('SEARCH_USERS')} onSearch={this.onSearch.bind(this)} />
                {(this.state.error) ? <Message type="error">{i18n('ERROR_RETRIEVING_USERS')}</Message> : <Table {...this.getTableProps()}/>}
                <div style={{textAlign: 'right', marginTop: 10}}>
                    <Button onClick={this.onCreateUser.bind(this)} type="secondary" size="medium">
                        <Icon size="sm" name="plus"/> {i18n('ADD_USER')}
                    </Button>
                </div>
            </div>
        );
    }

    getTableProps() {
        return {
            className: 'admin-panel-list-users__table',
            loading: this.state.loading,
            headers: this.getTableHeaders(),
            rows: this.state.users.map(this.getUserRow.bind(this)),
            pageSize: 10,
            page: this.state.page,
            pages: this.state.pages,
            onPageChange: this.onPageChange.bind(this)
        };
    }

    getTableHeaders() {
        return [
            {
                key: 'name',
                value: i18n('NAME'),
                className: 'admin-panel-list-users__table-name col-md-3'
            },
            {
                key: 'email',
                value: i18n('EMAIL'),
                className: 'admin-panel-list-users__table-email col-md-5'
            },
            {
                key: 'tickets',
                value: i18n('TICKETS'),
                className: 'admin-panel-list-users__table-tickets col-md-2',
                order: true,
                onOrderUp: this.orderByTickets.bind(this, 0),
                onOrderDown: this.orderByTickets.bind(this, 1)
            },
            {
                key: 'signupDate',
                value: i18n('SIGNUP_DATE'),
                className: 'admin-panel-list-users__table-date col-md-2',
                order: true,
                onOrderUp: this.orderById.bind(this, 0),
                onOrderDown: this.orderById.bind(this, 1)
            }
        ];
    }

    getUserRow(user) {
        return {
            name: (
                <div>
                    <Button className="admin-panel-list-users__name-link" type="link" route={{to: '/admin/panel/users/view-user/' + user.id}}>
                        {user.name}
                    </Button>
                    {user.disabled ? this.renderDisabled() : null}
                </div>
            ),
            email: user.email,
            tickets: (
                <span className="admin-panel-list-users__tickets-number">
                    {user.tickets}
                </span>
            ),
            signupDate: DateTransformer.transformToString(user.signupDate, false)
        };
    }

    renderDisabled() {
        return (
            <InfoTooltip className="admin-panel-list-users__name-disabled" type="warning" text={i18n('USER_DISABLED')} />
        );
    }

    onSearch(query) {
        this.retrieveUsers({
            page: 1,
            orderBy: 'id',
            desc: true,
            search: query
        });
    }

    onPageChange(event) {
        this.retrieveUsers({
            page: event.target.value,
            orderBy: this.state.orderBy,
            desc: this.state.desc,
            search: this.state.search
        });
    }

    orderByTickets(desc) {
        this.retrieveUsers({
            page: 1,
            orderBy: 'tickets',
            desc: desc,
            search: this.state.search
        });
    }

    orderById(desc) {
        this.retrieveUsers({
            page: 1,
            orderBy: 'id',
            desc: desc,
            search: this.state.search
        });
    }

    retrieveUsers(data) {
        this.setState({
            loading: true
        });

        API.call({
            path: '/user/get-users',
            data: data
        }).catch(this.onUsersRejected.bind(this)).then(this.onUsersRetrieved.bind(this));
    }

    onCreateUser(user) {
        ModalContainer.openModal(
            <div className="admin-panel-list-users__add-user-form">
                <MainSignUpWidget onSuccess={this.onCreateUserSuccess.bind(this)} />
                <div style={{textAlign: 'center'}}>
                    <Button onClick={ModalContainer.closeModal} type="link">{i18n('CLOSE')}</Button>
                </div>
            </div>
        );
    }
    onCreateUserSuccess() {
        ModalContainer.closeModal();
    }

    onUsersRetrieved(result) {
        this.setState({
            page: result.data.page * 1,
            pages: result.data.pages * 1,
            users: result.data.users,
            orderBy: result.data.orderBy,
            desc: (result.data.desc*1),
            error: false,
            loading: false
        });
    }

    onUsersRejected() {
        this.setState({
            error: true,
            loading: false
        });
    }
}

export default AdminPanelListUsers;
