import React from 'react';
import {connect} from 'react-redux';

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
import InviteUserWidget from 'app/admin/panel/users/invite-user-widget';

const DEFAULT_USERS_PARAMS = {
    page: 1,
    orderBy: 'id',
    desc: true,
    search: ''
}

class AdminPanelListUsers extends React.Component {
    state = {
        loading: true,
        users: [],
        usersParams: DEFAULT_USERS_PARAMS,
        error: false,
        pages: 1,
        showMessage: true
    };

    componentDidMount() {
        this.retrieveUsers(DEFAULT_USERS_PARAMS);
    }

    render() {
        return (
            <div className="admin-panel-list-users">
                <Header title={i18n('LIST_USERS')} description={i18n('LIST_USERS_DESCRIPTION')} />
                {(this.state.error) ? <Message showCloseButton={false} type="error">{i18n('ERROR_RETRIEVING_USERS')}</Message> : this.renderTableAndInviteButton()}
            </div>
        );
    }

    renderTableAndInviteButton() {
        const { message, showMessage } = this.state;

        return (
            <div>
                <SearchBox className="admin-panel-list-users__search-box" placeholder={i18n('SEARCH_USERS')} onSearch={this.onSearch.bind(this)} />
                {
                    (message === 'success') ?
                        <Message
                            showMessage={showMessage}
                            onCloseMessage={this.onCloseMessage.bind(this, "showMessage")}
                            className="admin-panel-list-users__success-message"
                            type="success">
                                {i18n('INVITE_USER_SUCCESS')}
                        </Message> :
                        null
                }
                <Table {...this.getTableProps()} />
                <div style={{textAlign: 'right', marginTop: 10}}>
                    <Button onClick={this.onInviteUser.bind(this)} type="secondary" size="medium">
                        <Icon size="sm" name="user-plus" /> {i18n('INVITE_USER')}
                    </Button>
                </div>
            </div>
        );
    }

    getTableProps() {
        const {loading, users, usersParams, pages } = this.state;

        return {
            className: 'admin-panel-list-users__table',
            loading,
            headers: this.getTableHeaders(),
            rows: users.map(this.getUserRow.bind(this)),
            pageSize: 10,
            page: usersParams.page,
            pages,
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
        const newUsersParams = {
            ...this.state.usersParams,
            page: DEFAULT_USERS_PARAMS.page,
            search: query
        }

        this.retrieveUsers(newUsersParams);

        this.setState({
            usersParams: newUsersParams
        });
    }

    onPageChange(event) {
        const newUsersParams = {
            ...this.state.usersParams,
            page: event.target.value,
        }

        this.retrieveUsers(newUsersParams);

        this.setState({
            usersParams: newUsersParams
        });
    }

    orderByTickets(desc) {
        const newUsersParams = {
            ...this.state.usersParams,
            orderBy: 'tickets',
            desc: desc
        }

        this.retrieveUsers(newUsersParams);

        this.setState({
            usersParams: newUsersParams
        });
    }

    orderById(desc) {
        const newUsersParams = {
            ...this.state.usersParams,
            orderBy: 'id',
            desc: desc
        }

        this.retrieveUsers(newUsersParams);

        this.setState({
            usersParams: newUsersParams
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

    onInviteUser(user) {
        ModalContainer.openModal(
            <div className="admin-panel-list-users__invite-user-form">
                <InviteUserWidget
                    onSuccess={this.onInviteUserSuccess.bind(this)}
                    onChangeMessage={this.onChangeMessage.bind(this)} />
            </div>,
            {
                closeButton: {
                    showCloseButton: true
                }
            }
        );
    }

    onChangeMessage(message) {
        this.setState({
            message,
            showMessage: true
        });
    }

    onInviteUserSuccess() {
        ModalContainer.closeModal();

        this.retrieveUsers(DEFAULT_USERS_PARAMS);
    }

    onUsersRetrieved(result) {
        const { page, pages, users, orderBy, desc } = result.data;

        this.setState({
            usersParams: {
                ...this.state.usersParams,
                page: page*1,
                orderBy: orderBy,
                desc: desc*1,
            },
            pages: pages*1,
            users: users,
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

    onCloseMessage(showMessage) {
        this.setState({
            [showMessage]: false
        });
    }
}

export default connect((store) => {
    return {
        config: store.config
    };
})(AdminPanelListUsers);
