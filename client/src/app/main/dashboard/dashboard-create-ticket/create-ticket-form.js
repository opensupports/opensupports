import React              from 'react';
import _                  from 'lodash';
import ReCAPTCHA          from 'react-google-recaptcha';
import { browserHistory } from 'react-router';

import i18n               from 'lib-app/i18n';
import API                from 'lib-app/api-call';
import SessionStore       from 'lib-app/session-store';
import store              from 'app/store';
import SessionActions     from 'actions/session-actions';

import Header             from 'core-components/header';
import Form               from 'core-components/form';
import FormField          from 'core-components/form-field';
import SubmitButton       from 'core-components/submit-button';
import Message            from 'core-components/message';

class CreateTicketForm extends React.Component {

    static propTypes = {
        userLogged: React.PropTypes.bool
    };

    static defaultProps = {
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
                <Header title={i18n('CREATE_TICKET')} description={i18n('CREATE_TICKET_DESCRIPTION')} />
                <Form loading={this.state.loading} onSubmit={this.onSubmit.bind(this)}>
                    {(!this.props.userLogged) ? this.renderEmailAndName() : null}
                    <div className="row">
                        <FormField className="col-md-7" label="Title" name="title" validation="TITLE" required field="input" fieldProps={{size: 'large'}}/>
                        <FormField className="col-md-5" label="Department" name="departmentId" field="select" fieldProps={{
                            items: SessionStore.getDepartments().map((department) => {return {content: department}}),
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
                <Captcha />
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
            data: _.extend({}, formState, {
                departmentId: formState.departmentId + 1
            })
        }).then(this.onTicketSuccess.bind(this)).catch(this.onTicketFail.bind(this));
    }

    onTicketSuccess() {
        this.setState({
            loading: false,
            message: 'success'
        });

        store.dispatch(SessionActions.getUserData());

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