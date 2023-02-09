import React from 'react';
import {connect}        from 'react-redux'

import SessionActions from 'actions/session-actions'
import history from 'lib-app/history';
import API from 'lib-app/api-call';

import Message from 'core-components/message';

class MainVerifyTokenPage extends React.Component {

    componentDidMount() {
        API.call({
            path: '/user/verify',
            data: {
                token: this.props.params.token,
                email: this.props.params.email
            }
        }).then(() => {
            this.props.dispatch(SessionActions.verify(true));
            history.push('/');
        }).catch(() => {
            this.props.dispatch(SessionActions.verify(false));
            history.push('/');
        });
    }

    render() {
        return null;
    }
}


export default connect((store) => {
    return {
        session: store.session
    };
})(MainVerifyTokenPage);