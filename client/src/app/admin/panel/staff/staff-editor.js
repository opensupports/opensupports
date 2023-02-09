import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {connect} from 'react-redux';

import AdminDataActions from 'actions/admin-data-actions';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';
import SessionStore from 'lib-app/session-store';
import TicketList from 'app-components/ticket-list';
import AreYouSure from 'app-components/are-you-sure';

import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Message from 'core-components/message';
import Button from 'core-components/button';
import Icon from 'core-components/icon';
import Loading from 'core-components/loading';
import statsUtils from 'lib-app/stats-utils';

const INITIAL_API_VALUE = {
    page: 1,
    closed: 0,
    departments: undefined,
};

class StaffEditor extends React.Component {
    static propTypes = {
        myAccount: React.PropTypes.bool,
        staffId: React.PropTypes.number,
        userId: React.PropTypes.number,
        email: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        profilePic: React.PropTypes.string.isRequired,
        level: React.PropTypes.number.isRequired,
        departments: React.PropTypes.array.isRequired,
        sendEmailOnNewTicket: React.PropTypes.bool,
        onChange: React.PropTypes.func,
        onDelete: React.PropTypes.func
    };

    state = {
        email: this.props.email,
        level: this.props.level - 1,
        message: null,
        loadingPicture: false,
        tickets: [],
        page: 1,
        pages: 0,
        department: undefined,
        departments: this.getUserDepartments(),
        closedTicketsShown: false,
        sendEmailOnNewTicket: this.props.sendEmailOnNewTicket,
        loadingReInviteStaff: false,
        reInviteStaff: "",
        loadingStats: true,
        showMessage: true,
        showReInviteStaffMessage: true,
        rawForm: {
            departments: [],
            owners: [{id: this.props.staffId}],
            tags: []
        },
        ticketData: {},
        ticketListLoading: false
    };

    componentDidMount() {
        this.retrieveStaffMembers();
        this.retrieveTicketsAssigned(INITIAL_API_VALUE);
        statsUtils.retrieveStats({
            rawForm: this.state.rawForm
        }).then(({data}) => {
            this.setState({
                ticketData: data,
                loadingStats: false
            });
        }).catch((error) => {
            if (showLogs) console.error('ERROR: ', error);
        });
    }

    render() {
        console.log('State: ', this.state.rawForm);

        const { name, level, profilePic, myAccount, staffId, staffList, userId } = this.props;
        const { message, tickets, loadingPicture, email } = this.state;
        const myData = _.filter(staffList, {id: `${staffId}`})[0];

        return (
            <div className="staff-editor">
                {message ? this.renderMessage() : null}
                <div className="row">
                    <div className="col-md-4">
                        <div className="staff-editor__card">
                            <div className="staff-editor__card-data">
                                <div className="staff-editor__card-name">
                                    {name}
                                </div>
                                <div className="staff-editor__card-info">
                                    <div className="staff-editor__card-badge">
                                        <span className="staff-editor__card-badge-blue">
                                            {level}
                                        </span>
                                        <span className="staff-editor__card-badge-text">{i18n('STAFF_LEVEL')}</span>
                                    </div>
                                    <div className="staff-editor__card-badge">
                                        <span className="staff-editor__card-badge-green">
                                            {myData.assignedTickets}
                                        </span>
                                        <span className="staff-editor__card-badge-text">{i18n('ASSIGNED')}</span>
                                    </div>
                                    <div className="staff-editor__card-badge">
                                        <span className="staff-editor__card-badge-red">
                                            {myData.closedTickets}
                                        </span>
                                        <span className="staff-editor__card-badge-text">{i18n('CLOSED')}</span>
                                    </div>
                                </div>
                            </div>
                            <label className={this.getPictureWrapperClass()}>
                                <div className="staff-editor__card-pic-background"></div>
                                <img className="staff-editor__card-pic" src={(profilePic) ? API.getFileLink(profilePic) : (API.getURL() + '/images/profile.png')} />
                                {(loadingPicture) ? <Loading className="staff-editor__card-pic-loading" size="large" /> : <Icon className="staff-editor__card-pic-icon" name="upload" size="4x" />}
                                <input className="staff-editor__image-uploader" type="file" multiple={false} accept="image/x-png,image/gif,image/jpeg" onChange={this.onProfilePicChange.bind(this)} />
                            </label>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="staff-editor__form">
                            <Form className="staff-editor__update-email" values={{email: email}} onChange={form => this.setState({email: form.email})} onSubmit={this.onSubmit.bind(this, 'EMAIL')}>
                                <FormField name="email" validation="EMAIL" required label={i18n('EMAIL')} fieldProps={{size: 'large'}} />
                                <SubmitButton size="medium" className="staff-editor__submit-button">{i18n('UPDATE_EMAIL')}</SubmitButton>
                            </Form>
                            <span className="separator staff-editor__separator" />
                            <Form className="staff-editor__update-password" onSubmit={this.onSubmit.bind(this, 'PASSWORD')}>
                                <FormField name="password" validation="PASSWORD" required label={i18n('PASSWORD')} fieldProps={{size: 'large', password: true}} />
                                <FormField name="rpassword" validation="REPEAT_PASSWORD" required label={i18n('REPEAT_PASSWORD')} fieldProps={{size: 'large', password: true}} />
                                <SubmitButton size="medium" className="staff-editor__submit-button">{i18n('UPDATE_PASSWORD')}</SubmitButton>
                            </Form>
                            {(myAccount) ? this.renderSendEmailOnNewTicketForm() : this.renderLevelForm()}
                            <span className="separator staff-editor__separator" />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="staff-editor__departments">
                            <div className="staff-editor__departments-title">{i18n('DEPARTMENTS')}</div>
                            {(myAccount && (level !== 3)) ? this.renderDepartmentsInfo() : this.renderDepartmentsForm()}
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="staff-editor__activity">
                            <div className="staff-editor__activity-title">{i18n('ACTIVITY')}</div>
                            {myData.lastLogin ? null : this.renderReInviteStaffButton()}
                            {this.renderReInviteStaffMessage()}
                            {this.renderStaffStats()}
                        </div>
                    </div>
                </div>
                {(tickets) ? this.renderTickets() : null}
                {((!myAccount) && (userId !== staffId)) ? this.renderDelete() : null}
            </div>
        );
    }

    renderReInviteStaffButton () {
        const inviteStaffButtonContent = <div><Icon name="user-plus" /> {i18n('INVITE_STAFF')}</div>;

        return (
            <div className="staff-editor__staff-invitation-content">
                {i18n('USER_UNLOGGED_IN')}
                <Button onClick={this.onReInviteStaffButton.bind(this)} size="medium" type="secondary" className="staff-editor__staff-invitation-button" disabled={this.state.loadingReInviteStaff}>
                    {this.state.loadingReInviteStaff ? <Loading /> : inviteStaffButtonContent}
                </Button>
            </div>
        );
    }

    renderReInviteStaffMessage() {
        const { reInviteStaff, showReInviteStaffMessage } = this.state;

        if (reInviteStaff) {
            return (
                <Message
                    showMessage={showReInviteStaffMessage}
                    onCloseMessage={this.onCloseMessage.bind(this, "showReInviteStaffMessage")}
                    className="staff-editor__staff-invitation-message"
                    type={reInviteStaff}
                    leftAligned>
                        {(reInviteStaff === "success") ? i18n('RESEND_STAFF_INVITATION_SUCCESS') : i18n('RESEND_STAFF_INVITATION_FAIL')}
                </Message>
            );
        } else {
            return null;
        }
    }

    onReInviteStaffButton() {
        this.setState({
            loadingReInviteStaff: true
        })

        API.call({
            path: '/staff/resend-invite-staff',
            data: {
                email: this.props.email
            }
        }).then(() => {
            this.setState({
                loadingReInviteStaff: false,
                reInviteStaff: 'success',
                showReInviteStaffMessage: true
            })
        }).catch(() => {
            this.setState({
                loadingReInviteStaff: false,
                reInviteStaff: 'error',
                showReInviteStaffMessage: true
            })
        })
    }

    renderMessage() {
        const { message, showMessage } = this.state;
        const messageType = (message === 'FAIL') ? 'error' : 'success';
        let _message = null;

        switch (message) {
            case 'EMAIL':
                _message = 'EMAIL_CHANGED';
                break;
            case 'PASSWORD':
                _message = 'PASSWORD_CHANGED';
                break;
            case 'LEVEL':
                _message = 'LEVEL_UPDATED';
                break;
            case 'DEPARTMENTS':
                _message = 'DEPARTMENTS_UPDATED';
                break;
            case 'SEND_EMAIL_ON_NEW_TICKET':
                _message = 'STAFF_UPDATED';
                break;
            case 'FAIL':
                _message = 'FAILED_EDIT_STAFF';
                break;
        }

        return (
            <Message
                showMessage={showMessage}
                onCloseMessage={this.onCloseMessage.bind(this, "showMessage")}
                className="staff-editor__message"
                type={messageType}>
                    {i18n(_message)}
            </Message>
        );
    }

    renderSendEmailOnNewTicketForm() {
        return (
            <div>
                <span className="separator staff-editor__separator" />
                <Form className="staff-editor__update-email-setting" values={{sendEmailOnNewTicket: this.state.sendEmailOnNewTicket}} onChange={form => this.setState({sendEmailOnNewTicket: form.sendEmailOnNewTicket})} onSubmit={this.onSubmit.bind(this, 'SEND_EMAIL_ON_NEW_TICKET')}>
                    <FormField name="sendEmailOnNewTicket" label={i18n('SEND_EMAIL_ON_NEW_TICKET')} field="checkbox" fieldProps={{size: 'large'}} />
                    <SubmitButton size="medium" className="staff-editor__submit-button">{i18n('UPDATE')}</SubmitButton>
                </Form>
            </div>
        );
    }

    renderLevelForm() {
        return (
            <div>
                <span className="separator staff-editor__separator" />
                <Form className="staff-editor__update-level" values={{level: this.state.level}} onChange={form => this.setState({level: form.level})} onSubmit={this.onSubmit.bind(this, 'LEVEL')}>
                    <FormField name="level" label={i18n('LEVEL')} field="select" infoMessage={this.getStaffLevelInfo()} fieldProps={{
                        items: [{content: i18n('LEVEL_1')}, {content: i18n('LEVEL_2')}, {content: i18n('LEVEL_3')}],
                        size: 'large'
                    }} />
                    <SubmitButton size="medium" className="staff-editor__submit-button">{i18n('UPDATE_LEVEL')}</SubmitButton>
                </Form>
            </div>
        );
    }

    renderDepartmentsForm() {
        return (
            <Form values={{departments: this.state.departments}} onChange={form => this.setState({departments: form.departments})} onSubmit={this.onSubmit.bind(this, 'DEPARTMENTS')}>
                <FormField name="departments" field="checkbox-group" fieldProps={{items: this.getDepartments()}} />
                <SubmitButton size="medium">{i18n('UPDATE_DEPARTMENTS')}</SubmitButton>
            </Form>
        );
    }

    renderDepartmentsInfo() {
        const { departments } = this.state;
        const departmentsAssigned = this.getDepartments().filter((_department, index) => departments.includes(index));

        return (
            <Form values={{departments: Array.from({length: departmentsAssigned.length}, (value, index) => index)}}>
                <FormField name="departments" field="checkbox-group" fieldProps={{items: departmentsAssigned}} />
            </Form>
        );
    }

    renderStaffStats() {
        const { loadingStats, ticketData } = this.state;

        return (
            <div className="admin-panel-stats">
                {
                    loadingStats ?
                        <Loading className="admin-panel-stats__loading" backgrounded size="large" /> :
                        statsUtils.renderStatistics({showStatCards: true, showStatsByHours: true, ticketData})
                }
            </div>
        )
    }

    renderTickets() {
        return (
            <div>
                <span className="separator" />
                <div className="staff-editor__tickets">
                    <div className="staff-editor__tickets-title">{i18n('TICKETS_ASSIGNED')}</div>
                        {this.state.ticketListLoading ?
                            <Loading className="staff-editor__ticketlist-loading" backgrounded size="large"/> :
                            <TicketList {...this.getTicketListProps()} />
                        }
                </div>
            </div>
        );
    }

    renderDelete() {
        return (
            <div>
                <span className="separator" />
                <div className="staff-editor__delete">
                    <div className="staff-editor__delete-title">
                        {i18n('DELETE_STAFF_MEMBER')}
                    </div>
                    <Button onClick={() => AreYouSure.openModal(i18n('WILL_DELETE_STAFF'), this.onDeleteClick.bind(this))}>
                        {i18n('DELETE_STAFF_MEMBER')}
                    </Button>
                </div>
            </div>
        );
    }

    getPictureWrapperClass() {
        let classes = {
            'staff-editor__card-pic-wrapper': true,
            'staff-editor__card-pic-wrapper_loading': this.state.loadingPicture
        };

        return classNames(classes);
    }

    getTicketListProps() {
        const { staffId, departments } = this.props;
        const { tickets, page, pages, closedTicketsShown } = this.state;

        return {
            type: 'secondary',
            userId: staffId,
            tickets,
            departments,
            closedTicketsShown,
            ticketPath: '/admin/panel/tickets/view-ticket/',
            page,
            pages,
            onPageChange: this.onPageChange.bind(this),
            onDepartmentChange: this.onDepartmentChange.bind(this),
            onClosedTicketsShownChange: this.onClosedTicketsShownChange.bind(this)
        };
    }

    getUserDepartments() {
        let userDepartments = this.props.departments.map(department => department.id);
        let departmentIndexes = [];

        _.forEach(SessionStore.getDepartments(), (department, index) => {
            if(_.includes(userDepartments, department.id)) {
                departmentIndexes.push(index);
            }
        });

        return departmentIndexes;
    }

    getDepartments() {
        return SessionStore.getDepartments().map(department => {
            if(department.private*1){
                return <span> {department.name} <Icon name='user-secret' /> </span>
            } else {
                return department.name;
            }
        });
    }

    getStaffLevelInfo() {
        return (
            <div className="staff-editor__level-info">
                <div className="staff-editor__level-info-box">
                    <span className="staff-editor__level-info-title">{i18n('LEVEL')} 1 </span>
                    <span className="staff-editor__level-info-description">{i18n('LEVEL_1_DESCRIPTION')}</span>
                </div>
                <div className="staff-editor__level-info-box">
                    <span className="staff-editor__level-info-title">{i18n('LEVEL')} 2 </span>
                    <span className="staff-editor__level-info-description">{i18n('LEVEL_2_DESCRIPTION')}</span>
                </div>
                <div className="staff-editor__level-info-box">
                    <span className="staff-editor__level-info-title">{i18n('LEVEL')} 3 </span>
                    <span className="staff-editor__level-info-description">{i18n('LEVEL_3_DESCRIPTION')}</span>
                </div>
            </div>
        );
    }

    onSubmit(eventType, form) {
        this.setState({
            loadingStats: true,
            ticketListLoading: true
        });

        const { myAccount, staffId, onChange } = this.props;
        let departments;

        if(form.departments) {
            departments = _.filter(SessionStore.getDepartments(), (department, index) => {
                return _.includes(form.departments, index);
            }).map(department => department.id)
        }

        API.call({
            path: '/staff/edit',
            data: {
                staffId: (!myAccount) ? staffId : null,
                sendEmailOnNewTicket: (eventType === 'SEND_EMAIL_ON_NEW_TICKET') ? form.sendEmailOnNewTicket * 1 : null,
                email: (eventType === 'EMAIL') ? form.email : null,
                password: (eventType === 'PASSWORD') ? form.password : null,
                level: ((form.level !== undefined) && (eventType == 'LEVEL')) ? form.level + 1 : null,
                departments: (eventType === 'DEPARTMENTS') ? (departments && JSON.stringify(departments)) : null
            }
        }).then(() => {
            this.retrieveStaffMembers();
            window.scrollTo(0,250);
            this.setState({
                message: eventType,
                showMessage: true,
                ticketListLoading: false
            });

            statsUtils.retrieveStats({
                rawForm: this.state.rawForm
            }).then(({data}) => {
                this.setState({ticketData: data, loadingStats: false});
            }).catch((error) => {
                if (showLogs) console.error('ERROR: ', error);
                this.setState({loadingStats: false});
            });

            this.retrieveTicketsAssigned({page: 1});
            onChange && onChange();
        }).catch(() => {
            window.scrollTo(0,250);
            this.setState({message: 'FAIL', loadingStats: false, showMessage: true});
        });
    }

    onDeleteClick() {
        const { staffId, onDelete } = this.props;

        return API.call({
            path: '/staff/delete',
            data: {
                staffId: staffId
            }
        }).then(onDelete).catch(() => {
            window.scrollTo(0,0);
            this.setState({message: 'FAIL', showMessage: true});
        });
    }

    onProfilePicChange(event) {
        const { myAcount, staffId, onChange } = this.props;

        this.setState({
            loadingPicture: true
        });

        API.call({
            path: '/staff/edit',
            dataAsForm: true,
            data: {
                staffId: (!myAcount) ? staffId : null,
                file: event.target.files[0]
            }
        }).then(() => {
            this.setState({
                loadingPicture: false
            });

            this.retrieveStaffMembers();
            onChange && onChange();
        }).catch(() => {
            window.scrollTo(0,0);
            this.setState({message: 'FAIL', loadingPicture: false, showMessage: true});
        });
    }

    retrieveTicketsAssigned({page, department, closed}) {
        API.call({
            path: '/ticket/search',
            data: {
                page,
                departments: department,
                closed,
                owners: `[${this.props.staffId}]`
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

    onPageChange(event) {
        this.setState({
            page: event.target.value
        });

        this.retrieveTicketsAssigned({page: event.target.value});
    }

    onDepartmentChange(department) {
        const { closedTicketsShown } = this.state;

        this.setState({
            department
        });

        this.retrieveTicketsAssigned(this.prepareFiltersForAPI({
            newClosedFilter: closedTicketsShown,
            newDepartmentFilter: department
        }));
    }

    onClosedTicketsShownChange() {
        const { department, closedTicketsShown } = this.state;
        const newClosedValue = !closedTicketsShown;

        this.setState({
            closedTicketsShown: newClosedValue
        });

        this.retrieveTicketsAssigned(this.prepareFiltersForAPI({
            newClosedFilter: newClosedValue,
            newDepartmentFilter: department
        }));
    }

    retrieveStaffMembers() {
        this.props.dispatch(AdminDataActions.retrieveStaffMembers());
    }

    prepareFiltersForAPI({newClosedFilter, newDepartmentFilter}) {
        return {
            closed: newClosedFilter ? undefined : 0,
            department: newDepartmentFilter ? `[${newDepartmentFilter}]` : undefined
        }
    }

    onCloseMessage(showMessage) {
        this.setState({
            [showMessage]: false
        });
    }
}

export default connect((store) => {
    return {
        staffList: store.adminData.staffMembers
    };
})(StaffEditor);
