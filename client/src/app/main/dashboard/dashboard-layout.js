import React from 'react';
import DashboardMenu from 'app/main/dashboard/dashboard-menu';

const DashboardLayout = React.createClass({

    render() {
        return (
            <div>
                <div><DashboardMenu location={this.props.location} /></div>
                <div>{this.props.children}</div>
            </div>
        );
    }
});

export default DashboardLayout;
