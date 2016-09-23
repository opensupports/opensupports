import React from 'react';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';

class AdminLoginPage extends React.Component {
    render(){
        return (
            <div className="admin-login-page">
                <div className="admin-login-page__content">
                    <div className="admin-login-page__image"><img width="100%" src="/images/logo.png" alt="OpenSupports Admin Panel"/></div>
                    <div className="admin-login-page__login-form">
                        <Form onSubmit={this.onSubmit.bind(this)}>
                            <FormField name="email" label={i18n('EMAIL')} field="input" validation="EMAIL" fieldProps={{size:'large'}} required />
                            <FormField name="password" label={i18n('PASSWORD')} field="input" validation="PASSWORD" fieldProps={{password:true, size:'large'}} required />
                            <SubmitButton> {i18n('LOG_IN')} </SubmitButton>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }

    onSubmit(formState) {
        
    }
}

export default AdminLoginPage;