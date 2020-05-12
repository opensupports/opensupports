import React from 'react';
import {connect} from 'react-redux';

import history from 'lib-app/history';
import AdminPanelViewTicket from 'app/admin/panel/tickets/admin-panel-view-ticket'

import Widget from 'core-components/widget';

class MainViewTicketPage extends React.Component {

    render() {
        return (
            <div className="main-view-ticket-page">
                <Widget>
                    <AdminPanelViewTicket
                      {...this.props}
                      avoidSeen
                      editable={false}
                      assignmentAllowed={false}
                      onRetrieveFail={this.onRetrieveFail.bind(this)} />
                </Widget>
            </div>
        );
    }

    onRetrieveFail() {
      setTimeout(() => {history.push('/check-ticket')}, 2000);
    }
}


export default connect((store) => {
    return {
        config: store.config
    };
})(MainViewTicketPage);