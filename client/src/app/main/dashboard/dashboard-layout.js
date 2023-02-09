import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import DashboardMenu from 'app/main/dashboard/dashboard-menu';
import Widget from 'core-components/widget';

class DashboardLayout extends React.Component {

    render() {
        return (this.props.session.logged) ? (
            <div className="dashboard">
                <div className={this.getDashboardMenuClass()}>
                    <DashboardMenu location={this.props.location} />
                </div>
                <div className={this.getDashboardContentClass()}>
                    <Widget className="col-md-12">
                        {this.props.children}
                    </Widget>
                </div>
            </div>
        ) : null;
    }

    getDashboardMenuClass() {
        let classes = {
            'dashboard__menu': true,
            'col-md-3': (this.props.config.layout === 'boxed'),
            'col-md-2': (this.props.config.layout === 'full-width')
        };

        return classNames(classes);
    }

    getDashboardContentClass() {
        let classes = {
            'dashboard__content': true,
            'col-md-9': (this.props.config.layout === 'boxed'),
            'col-md-10': (this.props.config.layout === 'full-width'),
            'col-md-offset-2': (this.props.config.layout === 'full-width')
        };

        return classNames(classes);
    }
}

export default connect((store) => {
    return {
        session: store.session,
        config: store.config
    };
})(DashboardLayout);
