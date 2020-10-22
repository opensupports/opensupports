import React from 'react';
import history from 'lib-app/history';
import {connect} from 'react-redux';
import _ from 'lodash';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';
import SessionActions from 'actions/session-actions';

import StaffEditor from 'app/admin/panel/staff/staff-editor';
import Header from 'core-components/header';
import Loading from 'core-components/loading';

class AdminPanelViewStaff extends React.Component {

    state = {
        loading: true,
        userData: {}
    };

    componentDidMount() {
        this.retrieveStaff();
    }

    render() {
        return (
            <div className="admin-panel-view-staff">
                <Header title={i18n('EDIT_STAFF')} description={i18n('EDIT_STAFF_DESCRIPTION')} />
                {(this.state.loading) ? <Loading /> : <StaffEditor {...this.getProps()} />}
            </div>
        );
    }

    getProps() {
        const { userData } = this.state;
        const {
            userId,
            params
        } = this.props;
        const userDataWithNumericLevel = {
            ...userData,
            level: userData.level*1,
            sendEmailOnNewTicket: userData.sendEmailOnNewTicket === "1",
            myAccount: this.props.userEmail == userData.email
        };

        return _.extend({}, userDataWithNumericLevel, {
            userId: userId*1,
            staffId: params.staffId*1,
            onDelete: this.onDelete.bind(this),
            onChange: this.retrieveStaff.bind(this)
        });
    }

    retrieveStaff() {
        API.call({
            path: '/staff/get',
            data: {
                staffId: this.props.params.staffId
            }
        }).then(this.onStaffRetrieved.bind(this));
    }

    onStaffRetrieved(result) {
        const {
            userId,
            params,
            dispatch
        } = this.props;

        this.setState({
            loading: false,
            userData: result.data
        });

        if(userId == params.staffId) dispatch(SessionActions.getUserData(null, null, true));
    }

    onDelete() {
        history.push('/admin/panel/staff/staff-members');
    }
}

export default connect((store) => store.session)(AdminPanelViewStaff);
