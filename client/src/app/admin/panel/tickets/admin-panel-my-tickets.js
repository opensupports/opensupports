import React from 'react';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';

import AdminDataAction from 'actions/admin-data-actions';
import Header from 'core-components/header';
import DropDown from 'core-components/drop-down';
import TicketList from 'app-components/ticket-list';

class AdminPanelMyTickets extends React.Component {
    
    componentDidMount() {
        this.props.dispatch(AdminDataAction.retrieveMyTickets());
    }
    
    render() {
        return (
            <div>
                <Header title={i18n('MY_TICKETS')} description={i18n('MY_TICKETS_DESCRIPTION')} />
                <DropDown {...this.getProps()} />
                <TicketList tickets={this.props.tickets} type="secondary" loading={true} />
            </div>
        );
    }

    getProps() {
        console.log(this.props.tickets);

        return {
            items: this.props.departments.map(function (obj) {
                return {
                    content: obj.name
                };
            }),
            size: 'medium'
        };
    }
}

export default connect((store) => {
    return {
        departments: store.session.userDepartments,
        tickets: store.adminData.myTickets
    };
})(AdminPanelMyTickets);
