import React from 'react';

import i18n from 'lib-app/i18n';
import SessionStore from 'lib-app/session-store';

import Header from 'core-components/header'
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';

class AddStaffModal extends React.Component {

    render() {
        return (
            <div className="add-staff-modal">
                <Header title={i18n('ADD_STAFF')} description={i18n('ADD_STAFF_DESCRIPTION')} />
                <Form onSubmit={this.onSubmit.bind(this)}>
                    <div className="row">
                        <div className="col-md-7">
                            <FormField name="name" label={i18n('NAME')} fieldProps={{size: 'large'}} validation="NAME" required />
                            <FormField name="email" label={i18n('EMAIL')} fieldProps={{size: 'large'}} validation="EMAIL" required />
                            <FormField name="password" label={i18n('PASSWORD')} fieldProps={{size: 'large', password: true}} validation="PASSWORD" required />
                            <div className="add-staff-modal__level-selector">
                                <FormField name="level" label={i18n('LEVEL')} field="select" fieldProps={{
                            items: [{content: i18n('LEVEL_1')}, {content: i18n('LEVEL_2')}, {content: i18n('LEVEL_3')}],
                            size: 'large'
                        }} />
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="add-staff-modal__departments">
                                <div className="add-staff-modal__departments-title">{i18n('Departments')}</div>
                                <FormField name="departments" field="checkbox-group" fieldProps={{items: this.getDepartments()}} />
                            </div>
                        </div>
                    </div>
                    <SubmitButton type="secondary" size="small">
                        {i18n('SAVE')}
                    </SubmitButton>
                </Form>
            </div>
        );
    }

    getDepartments() {
        return SessionStore.getDepartments().map((department) => department.name);
    }

    onSubmit(form) {
        console.log(form);
    }
}

export default AddStaffModal;