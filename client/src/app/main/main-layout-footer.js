import React              from 'react';
import {connect}          from 'react-redux';
import classNames         from 'classnames';
import i18n               from 'lib-app/i18n';

class MainLayoutFooter extends React.Component {

    render() {
        const {adminPanelOpened, userLogged} = this.props

        return (
            <div className={this.getClass()}>
                {adminPanelOpened ? this.renderExtraLinks() : null}
                {!userLogged ? this.renderAdminAccess() : null}
                <div className="main-layout-footer__powered">
                    Powered by <a className="main-layout-footer__os-link" href="http://www.opensupports.com/" target="_blank">OpenSupports</a>
                    <span> {adminPanelOpened ? `v${opensupports_version}` : null}</span>
                </div>
            </div>
        );
    }

    renderExtraLinks() {
        return (
            <div className="main-layout-footer__extra-links">
                <a className="main-layout-footer__extra-link" href="http://www.opensupports.com/documentation/" target="_blank">Documentation</a>
            </div>
        );
    }

    renderAdminAccess() {
        return (
            <div className="main-layout-footer__admin-access">
                <a className="main-layout-footer__admin-access-link" href="/admin">{i18n('ADMIN_ACCESS')}</a>
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
        adminPanelOpened: store.session.staff,
        userLogged: store.session.logged
    };
})(MainLayoutFooter);
