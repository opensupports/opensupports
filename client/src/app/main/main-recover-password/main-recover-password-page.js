import React  from 'react';
import _      from 'lodash';

import i18n            from 'lib-app/i18n';
import API             from 'lib-app/api-call';

import Widget          from 'core-components/widget';
import Form            from 'core-components/form';
import Input           from 'core-components/input';
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
            loading: false
        }
    }

    render() {
        return (
            <div className="main-recover-password-page">
                <Widget title={i18n('RECOVER_PASSWORD')} className="col-md-4 col-md-offset-4">
                    <Form className="recover-password__form" onSubmit={this.onRecoverPasswordSubmit.bind(this)} loading={this.state.loading}>
                        <div className="recover-password__inputs">
                            <Input placeholder={i18n('NEW_PASSWORD')} name="password" className="recover-password__input" validation="PASSWORD" password required/>
                            <Input placeholder={i18n('REPEAT_NEW_PASSWORD')} name="password-repeat" className="recover-password__input" validation="REPEAT_PASSWORD" password required/>
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
        switch (this.state.recoverStatus) {
            case 'valid':
                return <Message type="success">{i18n('VALID_RECOVER')}</Message>;
            case 'invalid':
                return <Message type="error">{i18n('INVALID_RECOVER')}</Message>;
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

    onPasswordRecovered() {
        setTimeout(() => {this.props.history.push('/app')}, 2000);
        this.setState({
            recoverStatus: 'valid',
            loading: false
        });
    }

    onPasswordRecoverFail() {
        this.setState({
            recoverStatus: 'invalid',
            loading: false
        });
    }
}

export default MainRecoverPasswordPage;