import React from 'react';

import i18n from 'lib-app/i18n';

import PeopleList from 'app-components/people-list';
import Header from 'core-components/header';
import DropDown from 'core-components/drop-down';

class AdminPanelStaffMembers extends React.Component {

    static propTypes = {
        departments: React.PropTypes.array
    };

    static defaultProps = {
        departments: []
    };

    render() {
        return (
            <div>
                <Header title={i18n('STAFF_MEMBERS')} description={i18n('STAFF_MEMBERS_DESCRIPTION')} />
                <DropDown {...this.getDepartmentDropdownProps()} />
                <PeopleList list={this.getStaffList()}/>
            </div>
        );
    }

    getDepartmentDropdownProps() {
        return {
            items: this.getDepartments(),
            onChange: (event) => {
                this.setState({
                    selectedDepartment: event.index && this.props.departments[event.index - 1].id
                });
            },
            size: 'medium'
        };
    }

    getDepartments() {
        let departments = this.props.departments.map((department) => {
            return {content: department.name};
        });

        departments.unshift({
            content: i18n('ALL_DEPARTMENTS')
        });

        return departments;
    }

    getStaffList() {
        return [
            {
                profilePic: 'http://www.opensupports.com/profilepic.jpg',
                name: 'Emilia Clarke',
                assignedTickets: 4,
                closedTickets: 21,
                lastLogin: 20161212
            },
            {
                profilePic: 'http://www.opensupports.com/profilepic.jpg',
                name: 'Yulian A GUI Yermo',
                assignedTickets: 9,
                closedTickets: 0,
                lastLogin: 20161212
            },
            {
                profilePic: 'http://www.opensupports.com/profilepic.jpg',
                name: 'Miltona Costa',
                assignedTickets: -1,
                closedTickets: -1,
                lastLogin: 20160212
            },
            {
                profilePic: 'http://www.opensupports.com/profilepic.jpg',
                name: 'Emiliasnikova Rusachestkvuy',
                assignedTickets: 100,
                closedTickets: 21,
                lastLogin: 20130101
            },
            {
                profilePic: 'http://www.opensupports.com/profilepic.jpg',
                name: 'Laurita Morrechaga Rusachestkvuy',
                assignedTickets: 1,
                closedTickets: 1,
                lastLogin: 2012050
            }
        ];
    }
}

export default AdminPanelStaffMembers;