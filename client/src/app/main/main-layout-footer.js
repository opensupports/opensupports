import React              from 'react';
import {connect}          from 'react-redux';
import classNames         from 'classnames';

class MainLayoutFooter extends React.Component {

    render() {
        return (
            <div className={this.getClass()}>
            </div>
        );
    }

    getClass() {
        let classes = {
            'main-layout-footer': true,
            'main-layout-footer_admin-panel': this.props.adminPanelOpened
        };

        return classNames(classes);
    }
}

export default connect((store) => {
    return {
        adminPanelOpened: store.session.staff
    };
})(MainLayoutFooter);
