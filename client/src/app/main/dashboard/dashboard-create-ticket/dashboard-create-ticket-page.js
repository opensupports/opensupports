import React from 'react';
import classNames from 'classnames';

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
                    <CreateTicketForm userLogged={(this.props.location.pathname !== '/create-ticket')} />
                </Wrapper>
            </div>
        );
    }

    getClass() {
        let classes = {
            'dashboard-create-ticket-page': true,
            'dashboard-create-ticket-page_wrapped': (this.props.location.pathname === '/create-ticket')
        };

        return classNames(classes);
    }
}

export default DashboardCreateTicketPage;
