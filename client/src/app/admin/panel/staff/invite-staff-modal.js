import React from 'react';
import _ from 'lodash';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';
import SessionStore from 'lib-app/session-store';

import Header from 'core-components/header'
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Button from 'core-components/button';
import Icon from 'core-components/icon';

class InviteStaffModal extends React.Component {

    static contextTypes = {
        closeModal: React.PropTypes.func
    };

    static propTypes = {
        onSuccess: React.PropTypes.func
    };

    state = {
        loading: false,
        errors: {},
        error: null
    };

    render() {
        return (
            <div className="invite-staff-modal">
                <Header title={i18n('INVITE_STAFF')} description={i18n('INVITE_STAFF_DESCRIPTION')} />
                <Form onSubmit={this.onSubmit.bind(this)} errors={this.getErrors()} onValidateErrors={errors => this.setState({errors})} loading={this.state.loading}>
                    <div className="row">
                        <div className="col-md-7">
                            <FormField name="name" label={i18n('NAME')} fieldProps={{size: 'large'}} validation="NAME" required />
                            <FormField name="email" label={i18n('EMAIL')} fieldProps={{size: 'large'}} validation="EMAIL" required />
                            <div className="invite-staff-modal__level-selector">
                                <FormField name="level" label={i18n('LEVEL')} field="select" fieldProps={{
                                    items: [{content: i18n('LEVEL_1')}, {content: i18n('LEVEL_2')}, {content: i18n('LEVEL_3')}],
                                    size: 'large'
                                }} />
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="invite-staff-modal__departments">
                                <div className="invite-staff-modal__departments-title">{i18n('Departments')}</div>
                                <FormField name="departments" field="checkbox-group" fieldProps={{items: this.getDepartments()}} />
                            </div>
                        </div>
                    </div>
                    <div className="invite-staff-modal__buttons-container">
                        <Button type="clean" onClick={this.onCancelClick.bind(this)}>
                            {i18n('CANCEL')}
                        </Button>
                        <SubmitButton type="secondary" size="small">
                            {i18n('SAVE')}
                        </SubmitButton>
                    </div>
                </Form>
            </div>
        );
    }

    getDepartments() {
        return SessionStore.getDepartments().map(department => {
            if(department.private*1){
                return <span>{department.name} <Icon name='user-secret'/> </span>
            } else {
                return department.name;
            }
        });
    }

    onSubmit(form) {
        let departments = _.filter(SessionStore.getDepartments(), (department, index) => {
            return _.includes(form.departments, index);
        }).map(department => department.id);

        this.setState({loading: true});

        API.call({
            path: '/staff/invite',
            data: {
                name: form.name,
                email: form.email,
                level: form.level + 1,
                departments: JSON.stringify(departments)
            }
        }).then(() => {
            this.context.closeModal();

            if(this.props.onSuccess) {
                this.props.onSuccess();
            }
        }).catch((result) => {
            this.setState({
                loading: false,
                error: result.message
            });
        });
    }

    onCancelClick(event) {
        event.preventDefault();
        this.context.closeModal();
    }

    getErrors() {
        let errors = _.extend({}, this.state.errors);

        if (this.state.error === 'ALREADY_A_STAFF') {
            errors.email = i18n('EMAIL_EXISTS');
        }

        return errors;
    }
}

export default InviteStaffModal;
