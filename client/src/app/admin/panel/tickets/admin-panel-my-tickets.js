import React from 'react';

import i18n from 'lib-app/i18n';

import Header from 'core-components/header';

class AdminPanelMyTickets extends React.Component {

    render() {
        return (
            <Header title={i18n('MY_TICKETS')} description={i18n('MY_TICKETS_DESCRIPTION')} />
        );
    }
}

export default AdminPanelMyTickets;