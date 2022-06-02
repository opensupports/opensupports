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

    updateTicketListRequestId = 0;

    state = {
        tickets: [],
        pages: 1,
        page: 1,
        form:{
            users: [],
            ownTickets: true
        },
        message: '',
        loading: false,
        showMessage: true
    };

    componentDidMount() {
        this.retrieveUserData();
        this.updateTicketList({users: [], ownTickets: true});
    }

    render() {
        const { userUsers } = this.props;
        const { loading, page, pages, tickets, message, showMessage } = this.state;

        return (
            <div className="dashboard-ticket-list">
                <Header title={i18n('TICKET_LIST')} description={i18n('TICKET_LIST_DESCRIPTION')} />
                {userUsers.length ? this.showSupervisorOptions() : null}
                <TicketList
                    loading={loading}
                    onPageChange={this.onPageChange.bind(this)}
                    page={page}
                    pages={pages}
                    tickets={tickets}
                    showPageSizeDropdown={false}
                    type={userUsers.length ? "secondary" : "primary"} />
                {
                    message ?
                        <Message
                            showMessage={showMessage}
                            onCloseMessage={this.onCloseMessage.bind(this, "showMessage")}
                            type="error">
                                {i18n(message)}
                        </Message> :
                        null
                }
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

    updateTicketList({users, page, ownTickets}) { 
        let id = ++this.updateTicketListRequestId;   
        let usersIds = users.map((item) => {
            return item.id
        })
        this.setState({loading: true})
        API.call({
            path: '/user/get-supervised-tickets',
            data: {
                page,
                showOwnTickets: ownTickets*1,
                supervisedUsers: JSON.stringify(usersIds)
            }
        }).then((r) => {
            if (id === this.updateTicketListRequestId){
                this.setState({
                    tickets: r.data.tickets,
                    pages: r.data.pages,
                    page: r.data.page,
                    message: '',
                    loading: false
                })
            }
        }).catch((r) => {
            this.setState({
                tickets: [],
                message: r.message,
                showMessage: true,
                loading: false
            })
        });
        
    }

    onCloseMessage(showMessage) {
        this.setState({
            [showMessage]: false
        });
    }
}


export default connect((store) => {
    return {
        userId: store.session.userId,
        userUsers: store.session.userUsers || []
    };
})(DashboardListTicketsPage);
