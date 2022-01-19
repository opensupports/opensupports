import React from 'react';
import {connect}  from 'react-redux';
import history from 'lib-app/history';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import TicketList from 'app-components/ticket-list';
import AreYouSure from 'app-components/are-you-sure';

import Header from 'core-components/header';
import Button from 'core-components/button';
import Message from 'core-components/message';
import InfoTooltip from 'core-components/info-tooltip';
import Autocomplete from 'core-components/autocomplete';

const INITIAL_API_VALUE = {
    page: 1,
    departments: undefined,
};

class AdminPanelViewUser extends React.Component {

    state = {
        name: '',
        email: '',
        verified: true,
        tickets: [],
        customfields: [],
        invalid: false,
        loading: true,
        disabled: false,
        userList: [],
        message: '',
        showMessage: true
    };

    componentDidMount() {
        this.retrieveUser();
        this.retrieveUserTickets(INITIAL_API_VALUE);
    }

    render() {
        return (
            <div className="admin-panel-view-user">
                <Header title={i18n('USER_VIEW_TITLE', {userId: this.props.params.userId})} description={i18n('USER_VIEW_DESCRIPTION')} />
                {(this.state.invalid) ? this.renderInvalid() : this.renderUserInfo()}
            </div>
        );
    }

    renderInvalid() {
        return (
            <div className="admin-panel-view-user__invalid">
                <Message showCloseButton={false} type="error">{i18n('INVALID_USER')}</Message>
            </div>
        );
    }

    renderUserInfo() {
        const { name, disabled, email, verified, customfields, loading } = this.state;

        return (
            <div className="admin-panel-view-user__content">
                <div className="admin-panel-view-user__info">
                    <div className="admin-panel-view-user__info-item">
                        {i18n('NAME')}
                        <div className="admin-panel-view-user__info-box">
                            {name}
                            {disabled ? this.renderDisabled() : null}
                        </div>
                    </div>
                    <div className="admin-panel-view-user__info-item">
                        {i18n('EMAIL')}
                        <div className="admin-panel-view-user__info-box">
                            {email}
                            {(!verified) ? this.renderNotVerified() : null}
                        </div>
                    </div>
                    {customfields.map(this.renderCustomField.bind(this))}
                    <div className="admin-panel-view-user__action-buttons">
                        <Button
                            className="admin-panel-view-user__action-button"
                            onClick={this.onDisableClick.bind(this)}
                            size="medium"
                            type={disabled ? 'tertiary' : 'primary'}>
                                {i18n(disabled ? 'ENABLE_USER' : 'DISABLE_USER')}
                        </Button>
                        <Button className="admin-panel-view-user__action-button" onClick={this.onDeleteClick.bind(this)} size="medium">
                            {i18n('DELETE_AND_BAN')}
                        </Button>
                    </div>
                </div>
                <span className="separator" />
                <div className="admin-panel-view-user">
                    <div className="admin-panel-view-user__supervised-users-container">
                        <div className="admin-panel-view-user__supervised-users-header">{i18n('SUPERVISED_USER')}</div>
                        <InfoTooltip className="admin-panel-view-user__info-tooltip" text={i18n('SUPERVISED_USER_INFORMATION')}/>
                    </div>
                    <div className="admin-panel-view-user__supervised-users-content">
                        <Autocomplete
                            onChange={this.onChangeValues.bind(this)}
                            getItemListFromQuery={this.searchUsers.bind(this)}
                            values={this.transformUserListToAutocomplete()} />
                        <Button
                            disabled={loading}
                            type="secondary"
                            className="admin-panel-view-user__submit-button"
                            onClick={this.onClickSupervisorUserButton.bind(this)}
                            size="medium">
                                {i18n('UPDATE')}
                        </Button>
                    </div>
                    {this.renderSupervisedUserMessage()}
                </div>
                <span className="separator" />
                <div className="admin-panel-view-user__tickets">
                    <div className="admin-panel-view-user__tickets-info-container">
                        <div className="admin-panel-view-user__tickets-title">{i18n('TICKETS')}</div>
                        <InfoTooltip className="admin-panel-view-user__info-tooltip" text={i18n('TICKETS_INFORMATION')}/>
                    </div>
                    <TicketList {...this.getTicketListProps()} />
                </div>
            </div>
        );
    }

    renderSupervisedUserMessage(){
        const { message, showMessage } = this.state;

        if(message) {
            if(message !== 'success') {
                return (
                    <Message
                        showMessage={showMessage}
                        onCloseMessage={this.onCloseMessage.bind(this, "showMessage")}
                        className="admin-panel-view-user__supervised-users-message"
                        type="error">
                            {i18n(message)}
                    </Message>
                );
            } else {
                return (
                    <Message
                        showMessage={showMessage}
                        onCloseMessage={this.onCloseMessage.bind(this, "showMessage")}
                        className="admin-panel-view-user__supervised-users-message"
                        type="success">
                            {i18n('SUPERVISED_USERS_UPDATED')}
                    </Message>
                );
            }
        } else {
            return null;
        }
    }

    onClickSupervisorUserButton(){
        this.setState({
            loading: true
        });

        const userIdList = this.state.userList.map((item) => {
            return item.id;
        });

        API.call({
            path: '/user/edit-supervised-list',
            data: {
                userIdList: JSON.stringify(userIdList),
                userId: this.props.params.userId
            }
        }).then(r => {
            this.setState({
                loading: false,
                message: 'success',
                showMessage: true
            })
        }).catch((r) => {
            this.setState({
                loading: false,
                message: r.message,
                showMessage: true
            })
        });
    }

    onChangeValues(newList) {
        this.setState({
            userList: newList
        });
    }

    searchUsers(query, blacklist = []) {
        blacklist = blacklist.map(item => {return {isStaff: item.isStaff, id: item.id}});

        return API.call({
            path: '/ticket/search-authors',
            data: {
                query: query,
                blackList: JSON.stringify(blacklist),
                searchUsers: 1
            }
        }).then(r => {
            const authorsListWithoutMe = r.data.authors.filter(author => author.id != this.props.params.userId);

            return authorsListWithoutMe.map(author => {
                const { id, name } = author;

                return {
                    name,
                    color: "gray",
                    id: id*1,
                    content: <div>{name}</div>,
                    isStaff: false
                }});
        }).catch((r) => {
            console.log(r);
        });
    }

    transformUserListToAutocomplete() {
        return(
            this.state.userList.map((user) => {
                const { id, name } = user;

                return ({
                    id: id*1,
                    name,
                    content: <div>{name}</div>,
                    color: 'grey',
                    isStaff: false
                });
            })
        );
    }

    renderNotVerified() {
        return (
            <InfoTooltip className="admin-panel-view-user__unverified" type="warning" text={i18n('UNVERIFIED_EMAIL')} />
        );
    }

    renderDisabled() {
        return (
            <InfoTooltip className="admin-panel-view-user__unverified" type="warning" text={i18n('USER_DISABLED')} />
        );
    }

    renderCustomField(_customfield) {
        const { customfield, value, id } = _customfield;

        return (
            <div className="admin-panel-view-user__info-item" key={`customFieldId__${id}`}>
                {customfield}
                <div className="admin-panel-view-user__info-box">
                    {(value !== "") ? value : <div className="admin-panel-view-user__empty-content">Empty</div>}
                </div>
            </div>
        );
    }

    getTicketListProps() {
        const { tickets, loading } = this.state;

        return {
            type: 'secondary',
            tickets,
            loading,
            departments: this.props.departments,
            ticketPath: '/admin/panel/tickets/view-ticket/'
        };
    }

    onUserRetrieved(result) {
        const { name, email, verified, disabled, customfields, userList } = result.data;

        this.setState({
            name,
            email,
            verified,
            disabled,
            customfields,
            loading: false,
            userList
        });
    }

    onDisableClick() {
        AreYouSure.openModal(
            i18n(this.state.disabled ? 'ENABLE_USER_DESCRIPTION' : 'DISABLE_USER_DESCRIPTION'),
            this.disableUser.bind(this)
        );
    }

    onDeleteClick() {
        AreYouSure.openModal(i18n('DELETE_USER_DESCRIPTION'), this.deleteUser.bind(this))
    }

    disableUser() {
        return API.call({
            path: this.state.disabled ? '/user/enable' : '/user/disable',
            data: {
                userId: this.props.params.userId
            }
        }).then(this.retrieveUser.bind(this));
    }

    deleteUser() {
        return API.call({
            path: '/user/delete',
            data: {
                userId: this.props.params.userId
            }
        }).then(() => {
            API.call({
                path: '/user/ban',
                data: {
                    email: this.state.email
                }
            }).then(() => history.push('/admin/panel/users/list-users'));
        });
    }

    retrieveUser() {
        API.call({
            path: '/user/get-user',
            data: {
                userId: this.props.params.userId
            }
        }).then(this.onUserRetrieved.bind(this)).catch(() => this.setState({
            invalid: true
        }));
    }

    getTicketListProps() {
        const { departments, params } = this.props;
        const { tickets, page, pages, loading } = this.state;

        return {
            type: 'secondary',
            userId: params.userId,
            tickets,
            loading,
            departments,
            ticketPath: '/admin/panel/tickets/view-ticket/',
            page,
            pages,
            onPageChange: this.onPageChange.bind(this),
            onDepartmentChange: this.onDepartmentChange.bind(this)
        };
    }

    onPageChange(event) {
        this.setState({
            page: event.target.value
        });

        this.retrieveUserTickets({page: event.target.value});
    }

    onDepartmentChange(department) {
        this.setState({
            department
        });

        this.retrieveUserTickets({
            department: department ? `[${department}]` : undefined
        });
    }

    retrieveUserTickets({page, department}) {
        API.call({
            path: '/ticket/search',
            data: {
                page,
                departments: department,
                authors: `[{"id":${this.props.params.userId}, "isStaff":0}]`
            }
        }).then((result) => {
            const data = result.data;

            this.setState({
                tickets: data.tickets,
                page: data.page,
                pages: data.pages
            });
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
        departments: store.session.userDepartments
    };
})(AdminPanelViewUser);
