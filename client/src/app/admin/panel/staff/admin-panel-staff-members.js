import React from 'react';
import _ from 'lodash';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';
import SessionStore from 'lib-app/session-store';
import PeopleList from 'app-components/people-list';

import Header from 'core-components/header';
import DropDown from 'core-components/drop-down';
import Button from 'core-components/button';
import Icon from 'core-components/icon';
import Loading from 'core-components/loading';

class AdminPanelStaffMembers extends React.Component {

    state = {
        selectedDepartment: 0,
        staffList: [],
        loading: true,
        page: 1
    };

    componentDidMount() {
        API.call({
            path: '/staff/get-all',
            data: {}
        }).then(this.onStaffRetrieved.bind(this));
    }

    render() {
        return (
            <div className="admin-panel-staff-members">
                <Header title={i18n('STAFF_MEMBERS')} description={i18n('STAFF_MEMBERS_DESCRIPTION')} />
                <div className="admin-panel-staff-members__wrapper">
                    <DropDown {...this.getDepartmentDropdownProps()} className="admin-panel-staff-members__dropdown" />
                    <Button size="medium" onClick={() => {}} type="secondary" className="admin-panel-staff-members__button">
                        <Icon name="user-plus" className=""/> {i18n('ADD_NEW_STAFF')}
                    </Button>
                </div>
                {(this.state.loading) ? <Loading backgrounded /> : <PeopleList list={this.getStaffList()} page={this.state.page} onPageSelect={(index) => this.setState({page: index+1})} />}
            </div>
        );
    }

    getDepartmentDropdownProps() {
        return {
            items: this.getDepartments(),
            onChange: (event) => {
                let departments = SessionStore.getDepartments();
                this.setState({
                    selectedDepartment: event.index && departments[event.index - 1].id,
                    page: 1
                });
            },
            size: 'medium'
        };
    }

    getStaffList() {
        if(!this.state.selectedDepartment) {
            return this.state.staffList;
        }

        return _.filter(this.state.staffList, (o) => {
            return _.findIndex(o.departments, {id: this.state.selectedDepartment}) !== -1;
        });
    }

    getDepartments() {
        let departments = SessionStore.getDepartments().map((department) => {
            return {content: department.name};
        });

        departments.unshift({
            content: i18n('ALL_DEPARTMENTS')
        });

        return departments;
    }

    onStaffRetrieved(result) {
        if(result.status == 'success'){
            this.setState({
                loading: false,
                staffList: result.data
            });
        }
    }
}

export default AdminPanelStaffMembers;