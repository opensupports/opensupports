import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';
import history from 'lib-app/history';

import SessionActions     from 'actions/session-actions';
import CreateTicketForm from 'app/main/dashboard/dashboard-create-ticket/create-ticket-form';

import Widget from 'core-components/widget';

class DashboardCreateTicketPage extends React.Component {

    static propTypes = {
        userSystemEnabled: React.PropTypes.bool
    };

    render() {
        let Wrapper = 'div';

        if((this.props.location.pathname === '/create-ticket')) {
            Wrapper = Widget;
        }

        return (
            <div className={this.getClass()}>
                <Wrapper>
                    <CreateTicketForm
                        userLogged={(this.props.location.pathname !== '/create-ticket')}
                        onSuccess={this.onCreateTicketSuccess.bind(this)}/>
                </Wrapper>
            </div>
        );
    }

    onCreateTicketSuccess(result, email, message) {
        if((this.props.location.pathname !== '/create-ticket')) {
            history.push(`/dashboard?message=${message}`);
        } else {
            setTimeout(() => {history.push('/check-ticket/' + result.data.ticketNumber + '/' + email)}, 1000);
        }
    }

    getClass() {
        let classes = {
            'dashboard-create-ticket-page': true,
            'dashboard-create-ticket-page_wrapped': (this.props.location.pathname === '/create-ticket'),
            'col-md-10 col-md-offset-1': (!this.props.config['user-system-enabled'])
        };

        return classNames(classes);
    }
}

export default connect((store) => {
    return {
        config: store.config
    };
})(DashboardCreateTicketPage);
