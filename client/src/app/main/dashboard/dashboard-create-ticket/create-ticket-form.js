import React              from 'react';
import _                  from 'lodash';
import ReCAPTCHA          from 'react-google-recaptcha';
import { browserHistory } from 'react-router';
import RichTextEditor from 'react-rte-browserify';

import i18n               from 'lib-app/i18n';
import API                from 'lib-app/api-call';
import SessionStore       from 'lib-app/session-store';
import store              from 'app/store';
import SessionActions     from 'actions/session-actions';
import LanguageSelector   from 'app-components/language-selector';
import Captcha            from 'app/main/captcha';

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

    state = {
        loading: false,
        message: null,
        form: {
            title: '',
            content: RichTextEditor.createEmptyValue(),
            departmentIndex: 0,
            email: '',
            name: '',
            language: 'en'
        }
    };

    render() {
        return (
            <div className="create-ticket-form">
                <Header title={i18n('CREATE_TICKET')} description={i18n('CREATE_TICKET_DESCRIPTION')} />
                <Form {...this.getFormProps()}>
                    {(!this.props.userLogged) ? this.renderEmailAndName() : null}
                    <FormField label={i18n('TITLE')} name="title" validation="TITLE" required field="input" fieldProps={{size: 'large'}}/>
                    <div className="row">
                        <FormField className="col-md-5" label={i18n('DEPARTMENT')} name="departmentIndex" field="select" fieldProps={{
                            items: SessionStore.getDepartments().map((department) => {return {content: department.name}}),
                            size: 'medium'
                        }} />
                        <FormField className="col-md-5" label={i18n('LANGUAGE')} name="language" field="select" decorator={LanguageSelector} fieldProps={{
                            type: 'supported',
                            size: 'medium'
                        }}/>
                    </div>
                    <FormField label={i18n('CONTENT')} name="content" validation="TEXT_AREA" required field="textarea" />
                    <div className="create-ticket-form__file">
                        <FormField name="file" field="file" />
                    </div>
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
                <Captcha ref="captcha"/>
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

    getFormProps() {
        return {
            loading: this.state.loading,
            onSubmit: this.onSubmit.bind(this),
            values: this.state.form,
            onChange: form => this.setState({form})
        };
    }

    onSubmit(formState) {
        let captcha = this.refs.captcha && this.refs.captcha.getWrappedInstance();

        if (captcha && !captcha.getValue()) {
            captcha.focus();
        } else {
            this.setState({
                loading: true
            });

            API.call({
                path: '/ticket/create',
                data: _.extend({}, formState, {
                    captcha: captcha && captcha.getValue(),
                    departmentId: SessionStore.getDepartments()[formState.departmentIndex].id
                })
            }).then(this.onTicketSuccess.bind(this)).catch(this.onTicketFail.bind(this));
        }
    }

    onTicketSuccess() {
        this.setState({
            loading: false,
            message: 'success'
        });

        if(this.props.userLogged) {
            store.dispatch(SessionActions.getUserData());
            setTimeout(() => {browserHistory.push('/dashboard')}, 2000);
        }
    }

    onTicketFail() {
        this.setState({
            loading: false,
            message: 'fail'
        });
    }
}

export default CreateTicketForm;