import React              from 'react';
import ReCAPTCHA          from 'react-google-recaptcha';
import { browserHistory } from 'react-router';

import i18n               from 'lib-app/i18n';
import API                from 'lib-app/api-call';

import SubmitButton       from 'core-components/submit-button';
import Message            from 'core-components/message';
import Form               from 'core-components/form';
import FormField          from 'core-components/form-field';

class CreateTicketForm extends React.Component {

    static propTypes = {
        userLogged: React.PropTypes.boolean
    };

    static defaultProps ={
        userLogged: true
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            message: null
        };
    }

    render() {
        return (
            <div className="create-ticket-form">
                <h2>Create Ticket</h2>
                <Form loading={this.state.loading} onSubmit={this.onSubmit.bind(this)}>
                    {(!this.props.userLogged) ? this.renderEmailAndName() : null}
                    <div className="row">
                        <FormField className="col-md-7" label="Title" name="title" validation="TITLE" required field="input" fieldProps={{size: 'large'}}/>
                        <FormField className="col-md-5" label="Department" name="departmentId" field="select" fieldProps={{
                            items: [
                                {content: 'Sales Support'},
                                {content: 'Technical Issues'},
                                {content: 'System and Administration'}
                            ],
                            size: 'medium'
                        }} />
                    </div>
                    <FormField label="Content" name="content" validation="TEXT_AREA" required field="textarea" />
                    {(!this.props.userLogged) ? this.renderCaptcha() : null}
                    <SubmitButton>Create Ticket</SubmitButton>
                </Form>
                {this.renderMessage()}
            </div>
        );
    }

    renderEmailAndName() {
        return (
            <div className="row">
                <FormField className="col-md-6" label="Email" name="email" validation="EMAIL" required field="input" fieldProps={{size: 'large'}}/>
                <FormField className="col-md-6" label="Full Name" name="name" validation="NAME" required field="input" fieldProps={{size: 'large'}}/>
            </div>
        );
    }

    renderCaptcha() {
        return (
            <div className="create-ticket-form__captcha">
                <ReCAPTCHA sitekey="6LfM5CYTAAAAAGLz6ctpf-hchX2_l0Ge-Bn-n8wS" onChange={function () {}}/>
            </div>
        );
    }

    renderMessage() {
        switch (this.state.message) {
            case 'success':
                return <Message className="create-ticket-form__message" type="success">{i18n('TICKET_SENT')}</Message>;
            case 'fail':
                return <Message className="create-ticket-form__message" type="error">{i18n('TICKET_SENT_ERROR')}</Message>;
            default:
                return null;
        }
    }

    onSubmit(formState) {
        this.setState({
            loading: true
        });

        API.call({
            path: '/ticket/create',
            data: formState
        }).then(this.onTicketSuccess.bind(this)).catch(this.onTicketFail.bind(this));
    }

    onTicketSuccess() {
        this.setState({
            loading: false,
            message: 'success'
        });

        setTimeout(() => {browserHistory.push('/dashboard')}, 2000);
    }

    onTicketFail() {
        this.setState({
            loading: false,
            message: 'fail'
        });
    }
}

export default CreateTicketForm;