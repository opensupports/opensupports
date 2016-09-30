import React from 'react';
import {connect} from 'react-redux';

import i18n from 'lib-app/i18n';

import Header from 'core-components/header';
import TicketList from 'app-components/ticket-list';
import TicketInfo from 'app-components/ticket-info';

class DashboardListTicketsPage extends React.Component {
    static propTypes = {
        tickets: React.PropTypes.arrayOf(React.PropTypes.object)
    };

    static defaultProps = {
        tickets: []
    };

    render() {
        return (
            <div className="dashboard-ticket-list">
                <Header title={i18n('TICKET_LIST')} description={i18n('TICKET_LIST_DESCRIPTION')} />
                <TicketList tickets={this.props.tickets} type="primary"/>
            </div>
        );
    }
}


export default connect((store) => {
    return {
        tickets: store.session.userTickets
    };
})(DashboardListTicketsPage);
