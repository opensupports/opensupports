import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';

import history from 'lib-app/history';
import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';
import SessionStore from 'lib-app/session-store';

import Widget from 'core-components/widget';
import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Captcha from 'app/main/captcha';

class MainCheckTicketPage extends React.Component {

    state = {
        loading: false,
        form: {
            email: this.props.params.email || '',
            ticketNumber: this.props.params.ticketNumber || ''
        },
        errors: {}
    };

    render() {
        return (
            <div className={this.getClass()}>
                <Widget>
                    <Header title={i18n('CHECK_TICKET')} description={i18n('VIEW_TICKET_DESCRIPTION')} />
                    <Form {...this.getFormProps()}>
                        <div className="main-check-ticket-page__inputs">
                            <div className="main-check-ticket-page__input">
                                <FormField name="email" label={i18n('EMAIL')} validation="EMAIL" required fieldProps={{size: 'large'}}/>
                            </div>
                            <div className="main-check-ticket-page__input">
                                <FormField name="ticketNumber" label={i18n('TICKET_NUMBER')} validation="DEFAULT" required fieldProps={{size: 'large'}}/>
                            </div>
                        </div>
                        <div className="main-check-ticket-page__captcha">
                            <Captcha ref="captcha"/>
                        </div>
                        <SubmitButton type="secondary">{i18n('CHECK_TICKET')}</SubmitButton>
                    </Form>
                </Widget>
            </div>
        );
    }

    getClass() {
        let classes = {
            'main-check-ticket-page': true,
        };

        return classNames(classes);
    }

    getFormProps() {
        return {
            className: 'main-check-ticket-page__form',
            loading: this.state.loading,
            values: this.state.form,
            errors: this.state.errors,
            onChange: (form) => this.setState({form}),
            onValidateErrors: (errors) => this.setState({errors}),
            onSubmit: this.onFormSubmit.bind(this)
        };
    }

    onFormSubmit(form) {
        const captcha = this.refs.captcha.getWrappedInstance();

        if (!captcha.getValue()) {
            captcha.focus();
        } else {
            this.setState({
                loading: true
            });

            API.call({
                path: '/ticket/check',
                data: {
                    captcha: captcha && captcha.getValue(),
                    ticketNumber: form.ticketNumber,
                    email: form.email
                }
            }).then(this.onTicketGetSuccess.bind(this)).catch(() => this.setState({
                loading: false,
                errors: {
                    email: i18n('INVALID_EMAIL_OR_TICKET_NUMBER'),
                    ticketNumber: i18n('INVALID_EMAIL_OR_TICKET_NUMBER')
                }
            }));
        }
    }

    onTicketGetSuccess(result) {
        SessionStore.createSession(result.data.userId, result.data.token, this.state.form.ticketNumber);
        setTimeout(() => {history.push('/view-ticket/' + this.state.form.ticketNumber)}, 2000);
    }
}

export default connect((store) => {
    return {
        config: store.config
    };
})(MainCheckTicketPage);
