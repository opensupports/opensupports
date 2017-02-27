import React from 'react';

import AdminPanelViewTicket from 'app/admin/panel/tickets/admin-panel-view-ticket'

import Widget from 'core-components/widget';

class MainViewTicketPage extends React.Component {

    render() {
        return (
            <div className="main-view-ticket-page">
                <Widget>
                    <AdminPanelViewTicket {...this.props} avoidSeen assignmentAllowed={false} />
                </Widget>
            </div>
        );
    }
}

export default MainViewTicketPage;