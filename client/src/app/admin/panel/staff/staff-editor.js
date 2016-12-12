import React from 'react';
import _ from 'lodash';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';
import SessionStore from 'lib-app/session-store';
import TicketList from 'app-components/ticket-list';

import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';

class StaffEditor extends React.Component {
    static propTypes = {
        staffId: React.PropTypes.number,
        email: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        profilePic: React.PropTypes.string.isRequired,
        level: React.PropTypes.number.isRequired,
        tickets: React.PropTypes.array.isRequired,
        departments: React.PropTypes.array.isRequired
    };

    state = {
        email: this.props.email,
        level: this.props.level - 1,
        departments: this.getUserDepartments()
    };
    
    render() {
        return (
            <div className="staff-editor">
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
                            <div className="staff-editor__card-pic-wrapper">
                                <img className="staff-editor__card-pic" src={this.props.profilePic} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="staff-editor__form">
                            <Form className="staff-editor__update-email" values={{email: this.state.email}} onChange={form => this.setState({email: form.email})} onSubmit={this.onSubmit.bind(this)}>
                                <FormField name="email" validation="EMAIL" required label={i18n('EMAIL')} fieldProps={{size: 'large'}}/>
                                <SubmitButton size="medium" className="staff-editor__submit-button">{i18n('UPDATE_EMAIL')}</SubmitButton>
                            </Form>
                            <span className="separator" />
                            <Form className="staff-editor__update-password" onSubmit={this.onSubmit.bind(this)}>
                                <FormField name="password" validation="PASSWORD" required label={i18n('PASSWORD')} fieldProps={{size: 'large'}}/>
                                <FormField name="rpassword" validation="REPEAT_PASSWORD" required label={i18n('REPEAT_PASSWORD')} fieldProps={{size: 'large'}}/>
                                <SubmitButton size="medium" className="staff-editor__submit-button">{i18n('UPDATE_PASSWORD')}</SubmitButton>
                            </Form>
                            <span className="separator"/>
                            <Form className="staff-editor__update-level" values={{level: this.state.level}} onChange={form => this.setState({level: form.level})} onSubmit={this.onSubmit.bind(this)}>
                                <FormField name="level" label={i18n('LEVEL')} field="select" fieldProps={{
                                    items: [{content: i18n('LEVEL_1')}, {content: i18n('LEVEL_2')}, {content: i18n('LEVEL_3')}],
                                    size: 'large'
                                }} />
                                <SubmitButton size="medium" className="staff-editor__submit-button">{i18n('UPDATE_LEVEL')}</SubmitButton>
                            </Form>
                            <span className="separator" />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="staff-editor__departments">
                            <div className="staff-editor__departments-title">{i18n('Departments')}</div>
                            <Form values={{departments: this.state.departments}} onChange={form => this.setState({departments: form.departments})} onSubmit={this.onSubmit.bind(this)}>
                                <FormField name="departments" field="checkbox-group" fieldProps={{items: this.getDepartments()}} />
                                <SubmitButton size="medium">{i18n('UPDATE_DEPARTMENTS')}</SubmitButton>
                            </Form>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="staff-editor__activity">
                            ACTIVITY
                        </div>
                    </div>
                </div>
                <span className="separator" />
                <div className="staff-editor__tickets">
                    <div className="staff-editor__tickets-title">{i18n('TICKETS')}</div>
                    <TicketList {...this.getTicketListProps()}/>
                </div>
            </div>
        );
    }

    getTicketListProps() {
        return {
            type: 'secondary',
            tickets: this.props.tickets,
            departments: this.props.departments,
            ticketPath: '/admin/panel/tickets/view-ticket/'
        };
    }

    getUserDepartments() {
        let userDepartments = this.props.departments.map(department => department.name);
        let departmentIndexes = [];

        _.forEach(this.getDepartments(), (department, index) => {
            if(_.includes(userDepartments, department)) {
                departmentIndexes.push(index);
            }
        });

        return departmentIndexes;
    }

    getDepartments() {
        return SessionStore.getDepartments().map(department => department.name);
    }

    onSubmit(form) {
        let departments;

        if(form.departments) {
            departments = _.filter(SessionStore.getDepartments(), (department, index) => {
                return _.includes(form.departments, index);
            }).map(department => department.id)
        }

        API.call({
            path: '/staff/edit',
            data: {
                staffId: this.props.staffId,
                email: form.email,
                password: form.password,
                level: (form.level !== undefined) ? form.level + 1 : null,
                departments: departments && JSON.stringify(departments)
            }
        });
    }
}

export default StaffEditor;