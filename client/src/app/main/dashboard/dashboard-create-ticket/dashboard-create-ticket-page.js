import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';

import Captcha from 'app/main/captcha';
import CreateTicketForm from 'app/main/dashboard/dashboard-create-ticket/create-ticket-form';
import Widget from 'core-components/widget';

class DashboardCreateTicketPage extends React.Component {

    static propTypes = {
        userSystemEnabled: React.PropTypes.bool
    };

    render() {
        let Wrapper = 'div';

        if(!this.props.userSystemEnabled) {
            Wrapper = Widget;
        }

        return (
            <div className={this.getClass()}>
                <Wrapper>
                    <CreateTicketForm userLogged={this.props.userSystemEnabled} />
                </Wrapper>
            </div>
        );
    }

    getClass() {
        let classes = {
            'dashboard-create-ticket-page': true,
            'dashboard-create-ticket-page_wrapped': (!this.props.userSystemEnabled)
        };

        return classNames(classes);
    }
}

export default connect((store) => {
    return {
        userSystemEnabled: store.config['user-system-enabled']
    };
})(DashboardCreateTicketPage);
