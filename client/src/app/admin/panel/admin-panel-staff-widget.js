import React from 'react';
import classNames from 'classnames';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';
import Button from 'core-components/button';

class AdminPanelStaffWidget extends React.Component {

    render() {
        return (
            <div className={this.getClass()}>
                <div className="admin-panel-staff-widget__user-data">
                    <div className="admin-panel-staff-widget__name">{this.props.session.userName}</div>
                    <div className="admin-panel-staff-widget__actions">
                        <Button className="admin-panel-staff-widget__action" type="link" route={{to:'/admin/panel/my-account'}}>
                            {i18n('MY_ACCOUNT')}
                        </Button>
                        <span className="admin-panel-staff-widget__action-separator">|</span>
                        <Button className="admin-panel-staff-widget__action" type="link" route={{to:'/signup'}} >
                            {i18n('CLOSE_SESSION')}
                        </Button>
                    </div>
                </div>
                <div className="admin-panel-staff-widget__profile-pic-wrapper">
                    <img className="admin-panel-staff-widget__profile-pic" src={this.props.session.userProfilePic} />
                </div>
            </div>
        );
    }

    getClass() {
        let classes = {
            'admin-panel-staff-widget': true
        };

        classes[this.props.className] = (this.props.className);

        return classNames(classes);
    }
}

export default connect((store) => {
    return {
        session: store.session
    };
})(AdminPanelStaffWidget);
