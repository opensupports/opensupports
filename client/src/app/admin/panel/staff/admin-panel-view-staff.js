import React from 'react';
import {browserHistory} from 'react-router';
import _ from 'lodash';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import StaffEditor from 'app/admin/panel/staff/staff-editor';
import Header from 'core-components/header';
import Loading from 'core-components/loading';

class AdminPanelViewStaff extends React.Component {

    state = {
        loading: true,
        userData: {}
    };

    componentDidMount() {
        API.call({
            path: '/staff/get',
            data: {
                staffId: this.props.params.staffId
            }
        }).then(this.onStaffRetrieved.bind(this));
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
        return _.extend({}, this.state.userData, {
            staffId: this.props.params.staffId * 1,
            onDelete: this.onDelete.bind(this)
        });
    }

    onStaffRetrieved(result) {
        this.setState({
            loading: false,
            userData: result.data
        });
    }

    onDelete() {
        browserHistory.push('/admin/panel/staff/staff-members');
    }
}

export default AdminPanelViewStaff;