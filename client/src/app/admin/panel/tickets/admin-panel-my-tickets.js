import React from 'react';
import _ from 'lodash';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';

import AdminDataAction from 'actions/admin-data-actions';
import Header from 'core-components/header';
import DropDown from 'core-components/drop-down';
import TicketList from 'app-components/ticket-list';

class AdminPanelMyTickets extends React.Component {

    static defaultProps = {
        departments: [],
        tickets: []
    };

    state = {
        selectedDepartment: 0
    };
    
    componentDidMount() {
        this.props.dispatch(AdminDataAction.retrieveMyTickets());
    }
    
    render() {
        return (
            <div className="admin-panel-my-tickets">
                <Header title={i18n('MY_TICKETS')} description={i18n('MY_TICKETS_DESCRIPTION')} />
                <div className="admin-panel-my-tickets__department-select">
                    <DropDown {...this.getDropdownProps()} />
                </div>
                <TicketList {...this.getProps()}/>
            </div>
        );
    }

    getProps() {
        return {
            tickets: this.getTickets(),
            type: 'secondary',
            loading: this.props.loading,
            ticketPath: '/admin/panel/tickets/view-ticket/'
        };
    }

    getDropdownProps() {
        return {
            items: this.getDepartments(),
            onChange: this.changeSelectedDepartment.bind(this),
            size: 'medium'
        };
    }

    getTickets() {
        return (this.state.selectedDepartment) ? _.filter(this.props.tickets, (ticket) => {
            return ticket.department.id == this.state.selectedDepartment
        }) : this.props.tickets;
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

    changeSelectedDepartment(event) {
        if(event.index === 0) {
            this.setState({
                selectedDepartment: 0
            });
        } else {
            this.setState({
                selectedDepartment: this.props.departments[event.index - 1].id
            });
        }
    }
}

export default connect((store) => {
    return {
        departments: store.session.userDepartments,
        tickets: store.adminData.myTickets,
        loading: !store.adminData.myTicketsLoaded
    };
})(AdminPanelMyTickets);
