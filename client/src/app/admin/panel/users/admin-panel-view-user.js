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

class AdminPanelViewUser extends React.Component {

    state = {
        name: '',
        email: '',
        verified: true,
        tickets: [],
        invalid: false,
        loading: true,
        disabled: false
    };

    componentDidMount() {
        this.retrieveUser();
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
                <Message type="error">{i18n('INVALID_USER')}</Message>
            </div>
        );
    }

    renderUserInfo() {
        return (
            <div className="admin-panel-view-user__content">
                <div className="admin-panel-view-user__info">
                    <div className="admin-panel-view-user__info-item">
                        {i18n('NAME')}
                        <div className="admin-panel-view-user__info-box">
                            {this.state.name}
                            {(this.state.disabled) ? this.renderDisabled() : null}
                        </div>
                    </div>
                    <div className="admin-panel-view-user__info-item">
                        {i18n('EMAIL')}
                        <div className="admin-panel-view-user__info-box">
                            {this.state.email}
                            {(!this.state.verified) ? this.renderNotVerified() : null}
                        </div>
                    </div>
                    <div className="admin-panel-view-user__action-buttons">
                        <Button
                            className="admin-panel-view-user__action-button"
                            onClick={this.onDisableClick.bind(this)}
                            size="medium"
                            type={this.state.disabled ? 'tertiary' : 'primary'}>
                            {i18n(this.state.disabled ? 'ENABLE_USER' : 'DISABLE_USER')}
                        </Button>
                        <Button className="admin-panel-view-user__action-button" onClick={this.onDeleteClick.bind(this)} size="medium">
                            {i18n('DELETE_AND_BAN')}
                        </Button>
                    </div>
                </div>
                <span className="separator" />
                <div className="admin-panel-view-user__tickets">
                    <div className="admin-panel-view-user__tickets-title">{i18n('TICKETS')}</div>
                    <TicketList {...this.getTicketListProps()}/>
                </div>
            </div>
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

    getTicketListProps() {
        return {
            type: 'secondary',
            tickets: this.state.tickets,
            loading: this.state.loading,
            departments: this.props.departments,
            ticketPath: '/admin/panel/tickets/view-ticket/'
        };
    }

    onUserRetrieved(result) {
        this.setState({
            name: result.data.name,
            email: result.data.email,
            verified: result.data.verified,
            tickets: result.data.tickets,
            disabled: result.data.disabled,
            loading: false
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
        API.call({
            path: this.state.disabled ? '/user/enable' : '/user/disable',
            data: {
                userId: this.props.params.userId
            }
        }).then(this.retrieveUser.bind(this));
    }

    deleteUser() {
        API.call({
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
}

export default connect((store) => {
    return {
        departments: store.session.userDepartments
    };
})(AdminPanelViewUser);
