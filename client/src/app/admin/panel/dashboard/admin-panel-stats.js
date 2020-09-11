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
        return (
            <div className="admin-panel-stats">
                <Header title={i18n('STATISTICS')} description={i18n('STATISTICS_DESCRIPTION')}/>
                {this.state.loading ? "Loading..." : this.renderTicketData()}
            </div>
        )
    }

    renderTicketData() {
        const {created, unsolved, solved, instant, reopened} = this.state.ticketData;
        const renderCard = (label, value, isPercentage) => {
            const displayValue = isPercentage ? value.toFixed(2) : value;
            return (
                <div className="admin-panel-stats__card-list__card">
                    {label}
                    <div className="admin-panel-stats__card-list__container">
                        {displayValue}{isPercentage ? "%" : ""}
                    </div>
                </div>
            );
        }

        return (
            <div className="admin-panel-stats__card-list">
                {renderCard("Created", created, false)}
                {renderCard("Unsolved", unsolved, false)}
                {renderCard("Solved", solved, false)}
                {renderCard("Instant", instant / solved, true)}
                {renderCard("Reopened", reopened / created, true)}
            </div>
        )
    }
}

export default AdminPanelStats;
