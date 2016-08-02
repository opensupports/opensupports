import React  from 'react';
import Reflux from 'reflux';
import _      from 'lodash';

import CommonActions   from 'actions/common-actions';
import UserActions     from 'actions/user-actions';
import UserStore       from 'stores/user-store';
import i18n            from 'lib-app/i18n';

import Widget          from 'core-components/widget';
import Form            from 'core-components/form';
import Input           from 'core-components/input';
import SubmitButton    from 'core-components/submit-button';
import Message         from 'core-components/message';

const MainRecoverPasswordPage = React.createClass({

    mixins: [Reflux.listenTo(UserStore, 'onUserStoreChanged')],

    propTypes: {
        location: React.PropTypes.object,
        router: React.PropTypes.object
    },

    componentWillMount() {
        if (UserStore.isLoggedIn()) {
            CommonActions.logged();
        }

        if (!this.props.location.query.token || !this.props.location.query.email) {
            CommonActions.loggedOut();
        }
    },

    getInitialState() {
        return {
            recoverStatus: 'waiting',
            loading: false
        };
    },

    render() {
        return (
            <div className="main-recover-password-page">
                <Widget title={i18n('RECOVER_PASSWORD')} className="col-md-4 col-md-offset-4">
                    <Form className="recover-password__form" onSubmit={this.handleRecoverPasswordSubmit} loading={this.state.loading}>
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
    },

    renderRecoverStatus() {
        switch (this.state.recoverStatus) {
            case 'valid':
                return <Message type="success">{i18n('VALID_RECOVER')}</Message>;
            case 'invalid':
                return <Message type="error">{i18n('INVALID_RECOVER')}</Message>;
            case 'waiting':
                return null;
        }
    },

    handleRecoverPasswordSubmit(formState) {
        let recoverData = _.clone(formState);
        recoverData.token = this.props.location.query.token;
        recoverData.email = this.props.location.query.email;

        UserActions.recoverPassword(recoverData);
        this.setState({
            loading: true
        });
    },

    onUserStoreChanged(event) {
        if (event === 'VALID_RECOVER') {
            setTimeout(CommonActions.loggedOut, 2000);
            this.setState({
                recoverStatus: 'valid',
                loading: false
            });
        } else {
            this.setState({
                recoverStatus: 'invalid',
                loading: false
            });
        }
    }
});

export default MainRecoverPasswordPage;