import React from 'react';
import {connect} from 'react-redux';

import SessionActions from 'actions/session-actions';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import Message from 'core-components/message';

import TicketList from 'app-components/ticket-list';

class DashboardListTicketsPage extends React.Component {
    static propTypes = {
        tickets: React.PropTypes.arrayOf(React.PropTypes.object)
    };

    static defaultProps = {
        tickets: []
    };
    
    state = {
        tickets: [],
        pages: 1,
        page: 1,
        form:{
            users: [],
            ownTickets: true
        },
        message: ''
    };

    componentDidMount() {
        this.retrieveUserData();
        this.updateTicketList({users: [], ownTickets: true});
    }

    render() {
        return (
            <div className="dashboard-ticket-list">
                <Header title={i18n('TICKET_LIST')} description={i18n('TICKET_LIST_DESCRIPTION')} />
                {this.props.userUsers ? this.showSupervisorOptions() : null}
                <TicketList onPageChange={this.onPageChange.bind(this)} page={this.state.page} pages={this.state.pages} tickets={this.state.tickets} type="primary"/>
                {this.state.message ? <Message type="error" >{i18n(this.state.message)}</Message> : null}
            </div>
        );
    }
    retrieveUserData() {
        this.props.dispatch(SessionActions.getUserData());
    }
    onPageChange(e){
        this.updateTicketList({...this.state.form, page: e.target.value});
    }
    showSupervisorOptions(){
        return(
            <Form className="dashboard-ticket-list__supervisor-form" values={this.state.form} onChange={this.onFormChange.bind(this)}>
                    <FormField label={i18n('SUPERVISED_USER')} name="users" field='autocomplete' fieldProps={{items: this.getUserItems()}}></FormField>
                    <FormField className="dashboard-ticket-list__supervisor-form-checkbox" label={i18n('SHOW_MY_TICKETS')} name="ownTickets" field="checkbox"/>
            </Form>
        )
    }
    
    getUserItems() {
        let usersList = this.props.userUsers.map(user => {
            return {
                id: user.id*1,
                name: user.name,
                content: <div>{user.name}</div>,
                color: 'grey',
                isStaff: false
            };
        });
        return usersList;
    }

    onFormChange(form){
        this.updateTicketList(form);
        this.setState({
            form
        });
    }

    updateTicketList(object = {}){
        
        let usersIds = object.users.map((item) => {
            return item.id
        })

        API.call({
            path: 'user/get-supervised-tickets',
            data: {
                page: object.page,
                showOwnTickets: object.ownTickets*1,
                supervisedUsers: JSON.stringify(usersIds)
            }
        }).then((r) => {
            this.setState({
                tickets: r.data.tickets,
                pages: r.data.pages,
                page: r.data.page,
                message: ''
            })
        }).catch((r) => {
            this.setState({
                tickets: [],
                message: r.message
            })
        });
        
    }
}


export default connect((store) => {
    return {
        userId: store.session.userId,
        userUsers: store.session.userUsers
    };
})(DashboardListTicketsPage);
