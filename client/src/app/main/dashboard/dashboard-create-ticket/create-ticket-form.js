import React              from 'react';
import ReCAPTCHA          from 'react-google-recaptcha';

import i18n               from 'lib-app/i18n';
import API                from 'lib-app/api-call';

import SubmitButton       from 'core-components/submit-button';
import Message            from 'core-components/message';
import Form               from 'core-components/form';
import FormField          from 'core-components/form-field';

class CreateTicketForm extends React.Component {
    render() {
        return (
            <div>
                <h2>Create Ticket</h2>
                <Form onSubmit={this.onSubmit.bind(this)}>
                    <div className="row">
                        <FormField className="col-md-7" label="Title" name="title" validation="TITLE" required field="input" fieldProps={{size: 'large'}}/>
                        <FormField className="col-md-5" label="Department" name="department" field="select" fieldProps={{
                            items: [
                                {content: 'Sales Support'},
                                {content: 'Technical Issues'},
                                {content: 'System and Administration'}
                            ],
                            size: 'medium'
                        }} />
                    </div>
                    <FormField label="Content" name="content" validation="TEXT_AREA" required field="textarea" />
                    <SubmitButton>Create Ticket</SubmitButton>
                </Form>
            </div>
        );
    }

    onSubmit(formState) {
        console.log(formState);
    }
}

export default CreateTicketForm;