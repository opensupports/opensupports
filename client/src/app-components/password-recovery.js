import React from 'react';
import classNames from 'classnames';

import i18n        from 'lib-app/i18n';
import API         from 'lib-app/api-call';

import Form             from 'core-components/form';
import FormField        from 'core-components/form-field';
import Widget           from 'core-components/widget';
import Button           from 'core-components/button';
import SubmitButton     from 'core-components/submit-button';
import Message          from 'core-components/message';

class PasswordRecovery extends React.Component {

    static propTypes = {
        recoverSent: React.PropTypes.bool,
        formProps: React.PropTypes.object,
        onBackToLoginClick: React.PropTypes.func,
        renderLogo: React.PropTypes.bool
    };

    static defaultProps = {
        renderLogo: false
    };

    render() {
        return (
            <Widget {...this.props} className="password-recovery__content">
                {this.renderLogo()}
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

    renderLogo() {
        let logo = null;

        if (this.props.renderLogo) {
            logo = (<div className="password-recovery__image"><img width="100%" src={API.getURL() + '/images/logo.png'} alt="OpenSupports Login Panel"/></div>);
        }

        return logo;
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
