import React from 'react';
import store from 'app/store';

import ConfigActions from 'actions/config-actions';

import MainLayout from 'app/main/main-layout';
import AdminPanelStaffWidget from 'app/admin/panel/admin-panel-staff-widget';
import AdminPanelMenu from 'app/admin/panel/admin-panel-menu';

import Widget from 'core-components/widget';

class AdminPanel extends React.Component {

    componentDidMount() {
        store.dispatch(ConfigActions.updateData());
    }
    
    render() {
        return (
            <MainLayout>
                <div className="admin-panel-layout">
                    <div className="row admin-panel-layout__header">
                        <div className="col-md-3">
                            <AdminPanelStaffWidget />
                        </div>
                        <div className="col-md-9">
                            <AdminPanelMenu location={this.props.location} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 admin-panel-layout__content">
                            <Widget className='admin-panel-layout__content__widget'>
                                {this.props.children}
                            </Widget>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }
}

export default AdminPanel;
