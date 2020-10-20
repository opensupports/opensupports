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
        userData: {},
        tickets: [],
        department: 1,
        page: 1,
        pages: 0
    };

    componentDidMount() {
        this.retrieveStaff();
        this.retrieveTicketsAssigned({page: 1, departments: '[1]'});
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
        const {
            userData,
            tickets,
            page,
            pages
        } = this.state;
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
            tickets,
            page,
            pages,
            onPageChange: this.onPageChange.bind(this),
            onDepartmentChange: this.onDepartmentChange.bind(this),
            onDelete: this.onDelete.bind(this),
            onChange: this.retrieveStaff.bind(this),
        });
    }

    onPageChange(event) {
        this.setState({
            page: event.target.value
        });

        this.retrieveTicketsAssigned({page: event.target.value});
    }

    onDepartmentChange(department) {
        this.setState({
            department
        });

        this.retrieveTicketsAssigned({department: department ? `[${department}]` : undefined});
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

    retrieveTicketsAssigned({page, department}) {
        API.call({
            path: '/ticket/search',
            data: {
                page,
                departments: department,
                owners: `[${this.props.params.staffId*1}]`
            }
        }).then((result) => {
            const data = result.data;

            this.setState({
                tickets: data.tickets,
                page: data.page,
                pages: data.pages
            });
        });
    }

    onDelete() {
        history.push('/admin/panel/staff/staff-members');
    }
}

export default connect((store) => store.session)(AdminPanelViewStaff);
