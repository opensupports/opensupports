import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import i18n from 'lib-app/i18n';
import SessionActions from 'actions/session-actions';

import StaffEditor from 'app/admin/panel/staff/staff-editor';
import Header from 'core-components/header';

class AdminPanelMyAccount extends React.Component {

    render() {
        return (
            <div className="admin-panel-view-staff">
                <Header title={i18n('MY_ACCOUNT')} description={i18n('MY_ACCOUNT_DESCRIPTION')} />
                <StaffEditor {...this.getEditorProps()}/>
            </div>
        );
    }

    getEditorProps() {
        return {
            myAccount: true,
            staffId: this.props.userId * 1,
            name: this.props.userName,
            email: this.props.userEmail,
            profilePic: this.props.userProfilePic,
            level: this.props.userLevel * 1,
            departments: this.props.userDepartments,
            sendEmailOnNewTicket: this.props.userSendEmailOnNewTicket,
            onChange: () => this.props.dispatch(SessionActions.getUserData(null, null, true))
        };
    }
}

export default connect((store) => store.session)(AdminPanelMyAccount);
