import React from 'react';

import UserStore from 'stores/user-store';
import CommonActions from 'actions/common-actions';

import DashboardMenu from 'app/main/dashboard/dashboard-menu';

const DashboardLayout = React.createClass({

    componentWillMount() {
        if (!UserStore.isLoggedIn()) {
            CommonActions.loggedOut();
        }
    },

    render() {
        return (UserStore.isLoggedIn()) ? (
            <div>
                <div><DashboardMenu location={this.props.location} /></div>
                <div>{this.props.children}</div>
            </div>
        ) : null;
    }
});

export default DashboardLayout;
