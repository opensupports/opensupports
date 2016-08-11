import React from 'react';
import {connect} from 'react-redux';

//import UserStore from 'stores/user-store';
//import CommonActions from 'actions/common-actions';

import DashboardMenu from 'app/main/dashboard/dashboard-menu';

const DashboardLayout = React.createClass({

    render() {
        return (this.props.session.logged) ? (
            <div>
                <div><DashboardMenu location={this.props.location} /></div>
                <div>{this.props.children}</div>
            </div>
        ) : null;
    }
});

export default connect((store) => {
    return {
        session: store.session
    };
})(DashboardLayout);
