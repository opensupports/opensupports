import React  from 'react';
import _      from 'lodash';

import i18n            from 'lib-app/i18n';
import API             from 'lib-app/api-call';
import history         from 'lib-app/history';

import Widget          from 'core-components/widget';
import Form            from 'core-components/form';
import FormField       from 'core-components/form-field';
import SubmitButton    from 'core-components/submit-button';
import Message         from 'core-components/message';

class MainRecoverPasswordPage extends React.Component {

    static propTypes = {
        location: React.PropTypes.object,
        router: React.PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            recoverStatus: 'waiting',
            loading: false,
            showMessage: true
        }
    }

    render() {
        return (
            <div className="main-recover-password-page">
                <Widget title={this.props.location.query.invited ? i18n('SET_UP_PASSWORD') : i18n('RECOVER_PASSWORD')} className="col-md-4 col-md-offset-4">
                    <Form className="recover-password__form" onSubmit={this.onRecoverPasswordSubmit.bind(this)} loading={this.state.loading}>
                        <div className="recover-password__inputs">
                            <FormField placeholder={i18n('NEW_PASSWORD')} name="password" className="recover-password__input" validation="PASSWORD" fieldProps={{password: true}} required/>
                            <FormField placeholder={i18n('REPEAT_NEW_PASSWORD')} name="password-repeat" className="recover-password__input" validation="REPEAT_PASSWORD" fieldProps={{password: true}} required/>
                        </div>
                        <div className="recover-password__submit-button">
                            <SubmitButton type="primary">{i18n('SUBMIT')}</SubmitButton>
                        </div>
                        {this.renderRecoverStatus()}
                    </Form>
                </Widget>
            </div>
        );
    }

    renderRecoverStatus() {
        const { recoverStatus, showMessage } = this.state;

        switch (recoverStatus) {
            case 'valid':
                return (
                    <Message
                        showMessage={showMessage}
                        onCloseMessage={this.onCloseMessage.bind(this, "showMessage")}
                        type="success">
                            {i18n('VALID_RECOVER')}
                    </Message>
                );
            case 'invalid':
                return (
                    <Message
                        showMessage={showMessage}
                        onCloseMessage={this.onCloseMessage.bind(this, "showMessage")}
                        type="error">
                            {i18n('INVALID_RECOVER')}
                    </Message>
                );
            case 'waiting':
                return null;
        }
    }

    onRecoverPasswordSubmit(formState) {
        let recoverData = _.clone(formState);
        recoverData.token = this.props.location.query.token;
        recoverData.email = this.props.location.query.email;

        this.setState({
            loading: true
        }, this.callRecoverPassword.bind(this, recoverData));
    }

    callRecoverPassword(recoverData) {
        API.call({
            path: '/user/recover-password',
            data: recoverData
        }).then(this.onPasswordRecovered.bind(this)).catch(this.onPasswordRecoverFail.bind(this));
    }

    onPasswordRecovered(response = {data: {}}) {
        setTimeout(() => {history.push((response.data.staff*1) ? '/admin' : '/')}, 2000);
        this.setState({
            recoverStatus: 'valid',
            showMessage: true,
            loading: false
        });
    }

    onPasswordRecoverFail() {
        this.setState({
            recoverStatus: 'invalid',
            showMessage: true,
            loading: false
        });
    }

    onCloseMessage(showMessage) {
        this.setState({
            [showMessage]: false
        });
    }
}

export default MainRecoverPasswordPage;
