import React from 'react';

import i18n from 'lib-app/i18n';
// import Stats from 'app-components/stats';
import Header from 'core-components/header';
import Tooltip from 'core-components/tooltip';
import API from 'lib-app/api-call';

class AdminPanelStats extends React.Component {

    state = {
        loading: true,
        ticketData: {}
    };

    componentDidMount() {
        API.call({
            path: '/system/stats',
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
        return (
            <div className="admin-panel-stats">
                <Header title={i18n('STATISTICS')} description={i18n('STATISTICS_DESCRIPTION')}/>
                {this.state.loading ? "Loading..." : this.renderTicketData()}
            </div>
        )
    }

    renderTicketData() {
        const {created, open, closed, instant, reopened} = this.state.ticketData;
        const renderCard = (label, description, value, isPercentage) => {
            const displayValue = isPercentage ? value.toFixed(2) : value;
            return (
                <div className="admin-panel-stats__card-list__card">
                    <Tooltip content={description} openOnHover>
                        {label}
                    </Tooltip>
                    <div className="admin-panel-stats__card-list__container">
                        {displayValue}{isPercentage ? "%" : ""}
                    </div>
                </div>
            );
        }

        return (
            <div className="admin-panel-stats__card-list">
                {renderCard(i18n('CREATED'), i18n('CREATED_DESCRIPTION'), created, false)}
                {renderCard(i18n('OPEN'), i18n('OPEN_DESCRIPTION'), open, false)}
                {renderCard(i18n('CLOSED'), i18n('CLOSED_DESCRIPTION'), closed, false)}
                {renderCard(i18n('INSTANT'), i18n('INSTANT_DESCRIPTION'), 100*instant / closed, true)}
                {renderCard(i18n('REOPENED'), i18n('REOPENED_DESCRIPTION'), 100*reopened / created, true)}
            </div>
        )
    }
}

export default AdminPanelStats;
