import React from 'react';
import {connect} from 'react-redux';

import DashboardMenu from 'app/main/dashboard/dashboard-menu';
import Widget from 'core-components/widget';

class DashboardLayout extends React.Component {

    render() {
        return (this.props.session.logged) ? (
            <div className="dashboard">
                <div className="dashboard__menu col-md-3"><DashboardMenu location={this.props.location} /></div>
                <Widget className="dashboard__content col-md-9">
                    {this.props.children}
                </Widget>
            </div>
        ) : null;
    }
}

export default connect((store) => {
    return {
        session: store.session
    };
})(DashboardLayout);
