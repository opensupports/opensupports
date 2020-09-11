import React from 'react';

import i18n from 'lib-app/i18n';
// import Stats from 'app-components/stats';
import Header from 'core-components/header';
import API from 'lib-app/api-call';

class AdminPanelStats extends React.Component {

    state = {
        loading: true,
        ticketData: {}
    };

    componentDidMount() {
        API.call({
            path: '/ticket/stats',
            data: {}
        }).then(({data}) => {
            this.setState({ticketData: data, loading: false}, () => {
                console.log('DATA:', this.state);
            });
        }).catch((error) => {
            console.error('ERROR: ', error);
        })
    }

    render() {
        // return (
        //     <div className="admin-panel-stats">
        //         <Header title={i18n('STATISTICS')} description={i18n('STATISTICS_DESCRIPTION')}/>
        //          <Stats type="general"/>
        //     </div>
        // );
        console.log('IS IT LOADING?: ', this.state.loading);
        return (
            <div className="admin-panel-stats">
                <Header title={i18n('STATISTICS')} description={i18n('STATISTICS_DESCRIPTION')}/>
                {this.state.loading ? "Loading..." : this.renderTicketData()}
            </div>
        )
    }

    renderTicketData() {
        return (
            <div>
                <div>Created: {this.state.ticketData.created}</div>
                <div>Unsolved: {this.state.ticketData.unsolved}</div>
                <div>Solved: {this.state.ticketData.solved}</div>
                <div>Instant: {this.state.ticketData.instant}</div>
                <div>Reopened: {this.state.ticketData.reopened}</div>
            </div>
        )
    }
}

export default AdminPanelStats;
