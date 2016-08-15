import React from 'react';
import {connect} from 'react-redux';

import DashboardMenu from 'app/main/dashboard/dashboard-menu';

class DashboardLayout extends React.Component {

    render() {
        return (this.props.session.logged) ? (
            <div>
                <div><DashboardMenu location={this.props.location} /></div>
                <div>{this.props.children}</div>
            </div>
        ) : null;
    }
}

export default connect((store) => {
    return {
        session: store.session
    };
})(DashboardLayout);
