import React from 'react';

import i18n from 'lib-app/i18n';

import Header from 'core-components/header'
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';

class AddStaffModal extends React.Component {

    render() {
        return (
            <div>
                <Header title={i18n('ADD_STAFF')} description={i18n('ADD_STAFF_DESCRIPTION')} />
                <Form onSubmit={this.onSubmit.bind(this)}>
                    <FormField name="name" label={i18n('NAME')} fieldProps={{size: 'large'}} validation="NAME" required />
                    <FormField name="email" label={i18n('EMAIL')} fieldProps={{size: 'large'}} validation="EMAIL" required />
                    <FormField name="password" label={i18n('PASSWORD')} fieldProps={{size: 'large'}} validation="PASSWORD" required />
                    <FormField name="level" label={i18n('LEVEL')} field="select" fieldProps={{
                            items: [{content: 'Level 1 - Easy'}, {content: 'Level 2 - Medium'}, {content: 'Level 3 - Hard'}],
                            size: 'medium'
                    }} />
                    <SubmitButton type="secondary" size="small">
                        {i18n('SAVE')}
                    </SubmitButton>
                </Form>
            </div>
        );
    }

    onSubmit(form) {
        console.log(form);
    }

}

export default AddStaffModal;