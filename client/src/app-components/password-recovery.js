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

    state = {
        showRecoverSentMessage: true
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.recoverSent && this.props.recoverSent) {
            this.setState({showRecoverSentMessage : true});
        }
    }

    render() {
        const { renderLogo, formProps, onBackToLoginClick, style } = this.props;

        return (
            <Widget style={style} className={this.getClass()} title={!renderLogo ? i18n('RECOVER_PASSWORD') : ''}>
                {this.renderLogo()}
                <Form {...formProps}>
                    <div className="password-recovery__inputs">
                        <FormField ref="email" placeholder={i18n('EMAIL_LOWERCASE')} name="email" className="password-recovery__input" validation="EMAIL" required/>
                    </div>
                    <div className="password-recovery__submit-button">
                        <SubmitButton type="primary">{i18n('RECOVER_PASSWORD')}</SubmitButton>
                    </div>
                </Form>
                <Button className="password-recovery__forgot-password" type="link" onClick={onBackToLoginClick} onMouseDown={(event) => {event.preventDefault()}}>
                    {i18n('BACK_LOGIN_FORM')}
                </Button>
                {this.renderRecoverStatus()}
            </Widget>
        );
    }

    getClass() {
        return classNames({
            'password-recovery__content': true,
            [this.props.className]: (this.props.className)
        });
    }

    renderLogo() {
        let logo = null;

        if (this.props.renderLogo) {
            logo = (<div className="password-recovery__image"><img width="100%" src={API.getURL() + '/images/logo.png'} alt="OpenSupports Login Panel"/></div>);
        }

        return logo;
    }

    renderRecoverStatus() {
        return (
            this.props.recoverSent ?
                <Message
                    showMessage={this.state.showRecoverSentMessage}
                    onCloseMessage={this.onCloseMessage.bind(this, "showRecoverSentMessage")}
                    className="password-recovery__message"
                    type="info"
                    leftAligned>
                        {i18n('RECOVER_SENT')}
                </Message> :
                null
        );
    }

    focusEmail() {
        this.refs.email.focus();
    }

    onCloseMessage(showMessage) {
        this.setState({
            [showMessage]: false
        });
    }
}

export default PasswordRecovery;
