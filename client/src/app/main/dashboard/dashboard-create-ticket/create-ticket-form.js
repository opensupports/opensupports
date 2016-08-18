import React              from 'react';
import ReCAPTCHA          from 'react-google-recaptcha';

import i18n               from 'lib-app/i18n';
import API                from 'lib-app/api-call';

import SubmitButton       from 'core-components/submit-button';
import Message            from 'core-components/message';
import Form               from 'core-components/form';
import Input              from 'core-components/input';
import TextEditor         from 'core-components/text-editor';
import DropDown           from 'core-components/drop-down';
import Widget             from 'core-components/widget';

class CreateTicketForm extends React.Component {
    render() {
        return (
            <div>
                <Form>
                    <DropDown items={[
                    {content: 'Department1'},
                    {content: 'Department2'},
                    {content: 'Department3'}
                    ]} />
                    <Input label="Title" name="title" required />
                    <TextEditor label="Content" name="content" required />
                </Form>
            </div>
        );
    }
}

export default CreateTicketForm;