import React from 'react';

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

    static propTypes = {
        departments: React.PropTypes.array
    };

    static defaultProps = {
        departments: []
    };

    state = {
        selectedDepartment: 0,
        staffList: [],
        loading: true
    };

    componentDidMount() {
        API.call({
            path: '/staff/get-all',
            data: {}
        }).then(this.onStaffRetrieved.bind(this));
    }

    render() {
        return (
            <div>
                <Header title={i18n('STAFF_MEMBERS')} description={i18n('STAFF_MEMBERS_DESCRIPTION')} />
                <DropDown {...this.getDepartmentDropdownProps()} />
                <Button size="medium" onClick={() => {}} type="secondary" className="">
                    <Icon name="user-plus" className=""/> {i18n('ADD_NEW_STAFF')}
                </Button>
                {(this.state.loading) ? <Loading backgrounded /> : <PeopleList list={this.state.staffList} />}
            </div>
        );
    }

    getDepartmentDropdownProps() {
        return {
            items: this.getDepartments(),
            onChange: (event) => {
                this.setState({
                    selectedDepartment: event.index  && this.props.departments[event.index - 1].id
                });
            },
            size: 'medium'
        };
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