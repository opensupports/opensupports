import React from 'react';
import classNames from 'classnames';

import i18n        from 'lib-app/i18n';

import Form             from 'core-components/form';
import FormField        from 'core-components/form-field';
import Widget           from 'core-components/widget';
import Button           from 'core-components/button';
import SubmitButton     from 'core-components/submit-button';

class PasswordRecovery extends React.Component {
    
    static propTypes = {
        recoverSent: React.PropTypes.bool,
        formProps: React.PropTypes.object,
        onBackToLoginClick: React.PropTypes.func
    };

    render() {
        return (
            <Widget title={i18n('RECOVER_PASSWORD')}>
                <Form {...this.props.formProps}>
                    <div className="password-recovery__inputs">
                        <FormField placeholder={i18n('EMAIL_LOWERCASE')} name="email" className="password-recovery__input" validation="EMAIL" required/>
                    </div>
                    <div className="password-recovery__submit-button">
                        <SubmitButton type="primary">{i18n('RECOVER_PASSWORD')}</SubmitButton>
                    </div>
                </Form>
                <Button className="password-recovery__forgot-password" type="link" onClick={this.props.onBackToLoginClick} onMouseDown={(event) => {event.preventDefault()}}>
                    {i18n('BACK_LOGIN_FORM')}
                </Button>
                {this.renderRecoverStatus()}
            </Widget>
        );
    }

    renderRecoverStatus() {
        let status = null;

        if (this.props.recoverSent) {
            status = (
                <Message className="password-recovery__message" type="info" leftAligned>
                    {i18n('RECOVER_SENT')}
                </Message>
            );
        }

        return status;
    }
}

export default PasswordRecovery;
