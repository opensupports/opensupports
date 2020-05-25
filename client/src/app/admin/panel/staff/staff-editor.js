import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';
import SessionStore from 'lib-app/session-store';
import TicketList from 'app-components/ticket-list';
import AreYouSure from 'app-components/are-you-sure';
// import Stats from 'app-components/stats';

import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Message from 'core-components/message';
import Button from 'core-components/button';
import Icon from 'core-components/icon';
import Loading from 'core-components/loading';

class StaffEditor extends React.Component {
    static propTypes = {
        myAccount: React.PropTypes.bool,
        staffId: React.PropTypes.number,
        email: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        profilePic: React.PropTypes.string.isRequired,
        level: React.PropTypes.number.isRequired,
        tickets: React.PropTypes.array.isRequired,
        departments: React.PropTypes.array.isRequired,
        sendEmailOnNewTicket: React.PropTypes.bool,
        onChange: React.PropTypes.func,
        onDelete: React.PropTypes.func
    };

    static defaultProps = {
        tickets: []
    };

    state = {
        email: this.props.email,
        level: this.props.level - 1,
        message: null,
        loadingPicture: false,
        departments: this.getUserDepartments(),
        sendEmailOnNewTicket: this.props.sendEmailOnNewTicket
    };

    render() {
        return (
            <div className="staff-editor">
                {(this.state.message) ? this.renderMessage() : null}
                <div className="row">
                    <div className="col-md-4">
                        <div className="staff-editor__card">
                            <div className="staff-editor__card-data">
                                <div className="staff-editor__card-name">
                                    {this.props.name}
                                </div>
                                <div className="staff-editor__card-info">
                                    <div className="staff-editor__card-badge">
                                        <span className="staff-editor__card-badge-blue">
                                            {this.props.level}
                                        </span>
                                        <span className="staff-editor__card-badge-text">{i18n('STAFF_LEVEL')}</span>
                                    </div>
                                    <div className="staff-editor__card-badge">
                                        <span className="staff-editor__card-badge-green">
                                            {_.filter(this.props.tickets, {closed: false}).length}
                                        </span>
                                        <span className="staff-editor__card-badge-text">{i18n('ASSIGNED')}</span>
                                    </div>
                                    <div className="staff-editor__card-badge">
                                        <span className="staff-editor__card-badge-red">
                                            {_.filter(this.props.tickets, {closed: true}).length}
                                        </span>
                                        <span className="staff-editor__card-badge-text">{i18n('CLOSED')}</span>
                                    </div>
                                </div>
                            </div>
                            <label className={this.getPictureWrapperClass()}>
                                <div className="staff-editor__card-pic-background"></div>
                                <img className="staff-editor__card-pic" src={(this.props.profilePic) ? API.getFileLink(this.props.profilePic) : (API.getURL() + '/images/profile.png')} />
                                {(this.state.loadingPicture) ? <Loading className="staff-editor__card-pic-loading" size="large"/> : <Icon className="staff-editor__card-pic-icon" name="upload" size="4x"/>}
                                <input className="staff-editor__image-uploader" type="file" multiple={false} accept="image/x-png,image/gif,image/jpeg" onChange={this.onProfilePicChange.bind(this)}/>
                            </label>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="staff-editor__form">
                            <Form className="staff-editor__update-email" values={{email: this.state.email}} onChange={form => this.setState({email: form.email})} onSubmit={this.onSubmit.bind(this, 'EMAIL')}>
                                <FormField name="email" validation="EMAIL" required label={i18n('EMAIL')} fieldProps={{size: 'large'}}/>
                                <SubmitButton size="medium" className="staff-editor__submit-button">{i18n('UPDATE_EMAIL')}</SubmitButton>
                            </Form>
                            <span className="separator staff-editor__separator" />
                            <Form className="staff-editor__update-password" onSubmit={this.onSubmit.bind(this, 'PASSWORD')}>
                                <FormField name="password" validation="PASSWORD" required label={i18n('PASSWORD')} fieldProps={{size: 'large', password: true}}/>
                                <FormField name="rpassword" validation="REPEAT_PASSWORD" required label={i18n('REPEAT_PASSWORD')} fieldProps={{size: 'large', password: true}}/>
                                <SubmitButton size="medium" className="staff-editor__submit-button">{i18n('UPDATE_PASSWORD')}</SubmitButton>
                            </Form>
                            {(this.props.myAccount) ? this.renderSendEmailOnNewTicketForm() : this.renderLevelForm()}
                            <span className="separator staff-editor__separator" />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="staff-editor__departments">
                            <div className="staff-editor__departments-title">{i18n('DEPARTMENTS')}</div>
                            {(this.props.myAccount && this.props.level !== 3)  ? this.renderDepartmentsInfo() : this.renderDepartmentsForm()}
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="staff-editor__activity">
                            <div className="staff-editor__activity-title">{i18n('ACTIVITY')}</div>
                            {this.renderStaffStats()}
                        </div>
                    </div>
                </div>
                {(this.props.tickets) ? this.renderTickets() : null}
                {(!this.props.myAccount) ? this.renderDelete() : null}
            </div>
        );
    }

    renderMessage() {
        let messageType = (this.state.message === 'FAIL') ? 'error' : 'success';
        let message = null;

        switch (this.state.message) {
            case 'EMAIL':
                message = 'EMAIL_CHANGED';
                break;
            case 'PASSWORD':
                message = 'PASSWORD_CHANGED';
                break;
            case 'LEVEL':
                message = 'LEVEL_UPDATED';
                break;
            case 'DEPARTMENTS':
                message = 'DEPARTMENTS_UPDATED';
                break;
            case 'SEND_EMAIL_ON_NEW_TICKET':
                message = 'STAFF_UPDATED';
                break;
            case 'FAIL':
                message = 'FAILED_EDIT_STAFF';
                break;
        }

        return <Message className="staff-editor__message" type={messageType}>{i18n(message)}</Message>;
    }

    renderSendEmailOnNewTicketForm() {
        return (
            <div>
                <span className="separator staff-editor__separator"/>
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
                <span className="separator staff-editor__separator"/>
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
        return (
            <Form values={{departments: this.state.departments}}>
                <FormField name="departments" field="checkbox-group" fieldProps={{items: this.getDepartments().filter((department,index) => this.state.departments.includes(index))}} />
            </Form>
        );
    }

    renderStaffStats() {
        // return (
        //     <Stats staffId={this.props.staffId} type="staff"/>
        // );

        return null;
    }

    renderTickets() {
        return (
            <div>
                <span className="separator"/>
                <div className="staff-editor__tickets">
                    <div className="staff-editor__tickets-title">{i18n('TICKETS')}</div>
                    <TicketList {...this.getTicketListProps()}/>
                </div>
            </div>
        );
    }

    renderDelete() {
        return (
            <div>
                <span className="separator"/>
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
        return {
            type: 'secondary',
            userId: this.props.staffId,
            tickets: this.props.tickets,
            departments: this.props.departments,
            ticketPath: '/admin/panel/tickets/view-ticket/'
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
            if(department.private * 1){
                return <span> {department.name} <Icon name='user-secret'/> </span>
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
        let departments;

        if(form.departments) {
            departments = _.filter(SessionStore.getDepartments(), (department, index) => {
                return _.includes(form.departments, index);
            }).map(department => department.id)
        }

        API.call({
            path: '/staff/edit',
            data: {
                staffId: (!this.props.myAccount) ? this.props.staffId : null,
                sendEmailOnNewTicket: (eventType === 'SEND_EMAIL_ON_NEW_TICKET') ? form.sendEmailOnNewTicket * 1 : null,
                email: (eventType === 'EMAIL') ? form.email : null,
                password: (eventType === 'PASSWORD') ? form.password : null,
                level: (form.level !== undefined && eventType == 'LEVEL') ? form.level + 1 : null,
                departments: (eventType === 'DEPARTMENTS') ? (departments && JSON.stringify(departments)) : null,
            }
        }).then(() => {
            window.scrollTo(0,0);
            this.setState({message: eventType});

            if(this.props.onChange) {
                this.props.onChange();
            }
        }).catch(() => {
            window.scrollTo(0,0);
            this.setState({message: 'FAIL'});
        });
    }

    onDeleteClick() {
        API.call({
            path: '/staff/delete',
            data: {
                staffId: this.props.staffId
            }
        }).then(this.props.onDelete).catch(() => {
            window.scrollTo(0,0);
            this.setState({message: 'FAIL'});
        });
    }

    onProfilePicChange(event) {
        this.setState({
            loadingPicture: true
        });

        API.call({
            path: '/staff/edit',
            dataAsForm: true,
            data: {
                staffId: (!this.props.myAcount) ? this.props.staffId : null,
                file: event.target.files[0]
            }
        }).then(() => {
            this.setState({
                loadingPicture: false
            });

            if(this.props.onChange) {
                this.props.onChange();
            }
        }).catch(() => {
            window.scrollTo(0,0);
            this.setState({message: 'FAIL', loadingPicture: false});
        });
    }
}

export default StaffEditor;
