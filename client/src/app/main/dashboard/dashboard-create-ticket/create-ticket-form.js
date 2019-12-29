import React              from 'react';
import _                  from 'lodash';
import {connect}          from 'react-redux';

import history            from 'lib-app/history';
import i18n               from 'lib-app/i18n';
import API                from 'lib-app/api-call';
import SessionStore       from 'lib-app/session-store';
import LanguageSelector   from 'app-components/language-selector';
import Captcha            from 'app/main/captcha';
import DepartmentDropdown from 'app-components/department-dropdown';

import Header             from 'core-components/header';
import TextEditor         from 'core-components/text-editor';
import Form               from 'core-components/form';
import FormField          from 'core-components/form-field';
import SubmitButton       from 'core-components/submit-button';
import Message            from 'core-components/message';

class CreateTicketForm extends React.Component {

    static propTypes = {
        userLogged: React.PropTypes.bool,
        onSuccess: React.PropTypes.func,
    };

    static defaultProps = {
        userLogged: true
    };

    state = {
        loading: false,
        message: null,
        form: {
            title: '',
            content: TextEditor.createEmpty(),
            departmentIndex: 0,
            email: '',
            name: '',
            language: this.props.language
        }
    };

    render() {
        return (
            <div className="create-ticket-form">
                <Header title={i18n('CREATE_TICKET')} description={i18n('CREATE_TICKET_DESCRIPTION')} />
                <Form {...this.getFormProps()}>
                    {(!this.props.userLogged) ? this.renderEmailAndName() : null}
                    <FormField label={i18n('TITLE')} name="title" validation="TITLE" required field="input" fieldProps={{size: 'auto'}}/>
                    <FormField label={i18n('CLIENT_SITE_PATH')} name="site_url" validation="SITE_URL" required field="input" fieldProps={{size: 'auto', url: true}}/>
                    <div className="row">
                        <FormField className="col-md-5" label={i18n('DEPARTMENT')} name="departmentIndex" field="select" decorator={DepartmentDropdown} fieldProps={{
                            departments: SessionStore.getDepartments(),
                            size: 'medium'
                        }} />
                        <FormField className="col-md-5" label={i18n('LANGUAGE')} name="language" field="select" decorator={LanguageSelector} fieldProps={{
                            type: 'supported',
                            size: 'medium'
                        }}/>
                    </div>
                    <FormField
                        label={i18n('CONTENT')}
                        name="content"
                        validation="TEXT_AREA"
                        fieldProps={{allowImages: this.props.allowAttachments}}
                        required
                        field="textarea" />
                    {(this.props.allowAttachments) ? this.renderFileUpload() : null}
                    {(!this.props.userLogged) ? this.renderCaptcha() : null}
                    <SubmitButton>{i18n('CREATE_TICKET')}</SubmitButton>
                </Form>
                {this.renderMessage()}
            </div>
        );
    }

    renderEmailAndName() {
        return (
            <div className="row">
                <FormField className="col-md-6" label={i18n('EMAIL')} name="email" validation="EMAIL" required field="input" fieldProps={{size: 'large'}}/>
                <FormField className="col-md-6" label={i18n('FULL_NAME')} name="name" validation="NAME" required field="input" fieldProps={{size: 'large'}}/>
            </div>
        );
    }

    renderFileUpload() {
        return (
            <div className="create-ticket-form__file">
                <FormField name="file" field="file" />
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
                dataAsForm: true,
                data: _.extend({}, formState, TextEditor.getContentFormData(formState.content), {
                    captcha: captcha && captcha.getValue(),
                    departmentId: SessionStore.getDepartments()[formState.departmentIndex].id
                })
            }).then(this.onTicketSuccess.bind(this, formState.email)).catch(this.onTicketFail.bind(this));
        }
    }

    onTicketSuccess(email, result) {
        this.setState({
            loading: false,
            message: 'success'
        }, () => {
            if(this.props.onSuccess) {
                this.props.onSuccess(result, email);
            }
        });
    }

    onTicketFail() {
        this.setState({
            loading: false,
            message: 'fail'
        });
    }
}

export default connect((store) => {
    const { language, supportedLanguages } = store.config;

    return {
        language: _.includes(supportedLanguages, language) ? language : supportedLanguages[0],
        allowAttachments: store.config['allow-attachments']
    };
})(CreateTicketForm);
