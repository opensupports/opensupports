import React from 'react';
import {connect}  from 'react-redux';
import {browserHistory} from 'react-router';

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
        loading: true
    };

    componentDidMount() {
        API.call({
            path: '/user/get-user',
            data: {
                userId: this.props.params.userId
            }
        }).then(this.onUserRetrieved.bind(this)).catch(() => this.setState({
            invalid: true
        }));
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
                        </div>
                    </div>
                    <div className="admin-panel-view-user__info-item">
                        {i18n('EMAIL')}
                        <div className="admin-panel-view-user__info-box">
                            {this.state.email}
                            {(!this.state.verified) ? this.renderNotVerified() : null}
                        </div>
                    </div>
                    <div className="admin-panel-view-user__delete-button">
                        <Button onClick={this.onDeleteClick.bind(this)} size="medium">{i18n('DELETE_AND_BAN')}</Button>
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
            loading: false
        });
    }

    onDeleteClick() {
        AreYouSure.openModal(i18n('DELETE_USER_DESCRIPTION'), this.deleteUser.bind(this))
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
            }).then(() => browserHistory.push('/admin/panel/users/list-users'));
        });
    }
}

export default connect((store) => {
    return {
        departments: store.session.userDepartments
    };
})(AdminPanelViewUser);
