import React              from 'react';
import _                  from 'lodash';
import classNames         from 'classnames';
import { connect }        from 'react-redux'
import DocumentTitle      from 'react-document-title';

import SessionActions from 'actions/session-actions';

import i18n from 'lib-app/i18n';
import history from 'lib-app/history';
import ModalContainer from 'app-components/modal-container';

import Message from 'core-components/message';
import Button from 'core-components/button';

const level2Paths = [
    '/admin/panel/tickets/custom-responses',
    '/admin/panel/users',
    '/admin/panel/articles'
];

const level3Paths = [
    '/admin/panel/staff',
    '/admin/panel/settings'
];

class App extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object,
        location: React.PropTypes.object
    };

    componentWillMount() {
        this.redirectIfPathIsNotValid(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.redirectIfPathIsNotValid(nextProps);
    }

    render() {
        return (
            <DocumentTitle title={this.props.config.title}>
                <div className={this.getClass()}>
                    <div className="application__content">
                        {React.cloneElement(this.props.children, {})}
                    </div>
                    <ModalContainer />
                </div>
            </DocumentTitle>
        );
    }

    getClass() {
        let classes = {
            'application': true,
            'application_modal-opened': (this.props.modal.opened),
            'application_full-width': (this.props.config.layout === 'full-width' && !_.includes(this.props.location.pathname, '/admin')),
            'application_user-system': (this.props.config['user-system-enabled'])
        };

        return classNames(classes);
    }

    redirectIfPathIsNotValid(props) {
        const {pathname} = props.location;
        const validations = {
            languageChanged: props.config.language !== this.props.config.language,
            loggedIn: !_.includes(pathname, '/dashboard') && props.session.logged,
            loggedOut: _.includes(pathname, '/dashboard') && !props.session.logged,
            loggedInStaff: !_.includes(pathname, '/admin/panel') && props.session.logged && props.session.staff,
            loggedOutStaff: _.includes(pathname, '/admin/panel') && !props.session.logged
        };

        if(props.config['maintenance-mode'] && !_.includes(pathname, '/admin') && !_.includes(pathname, '/maintenance')) {
            history.push('/maintenance');
        }

        if(!props.config['maintenance-mode'] && _.includes(pathname, '/maintenance')) {
            history.push('/');
        }

        if (validations.languageChanged) {
            window.location.reload();
        }

        if (validations.loggedOut) {
            history.push('/');
        }

        if (validations.loggedOutStaff) {
            history.push('/admin');
        }

        if (validations.loggedIn && !props.session.staff) {
            history.push('/dashboard');
        } else if(validations.loggedInStaff) {
            history.push('/admin/panel');
        }

        if (props.session.userLevel && !this.isPathAvailableForStaff(props)) {
            history.push('/admin/panel');
        }

        if (!props.config.registration && _.includes(pathname, 'signup')) {
            history.push('/');
        }

        if(props.config['user-system-enabled'] && _.includes(pathname, '/check-ticket')) {
            history.push('/');
        }

        if(props.config.installedDone && !props.config.installed && !_.includes(pathname, '/install')) {
            history.push('/install');
        }

        if(props.config.installedDone && props.config.installed && _.includes(pathname, '/install')) {
            history.push('/admin');
        }

        if(isProd && _.includes(pathname, '/components-demo')) {
            history.push('/');
        }

        if(props.session.logged && props.session.staff && !props.modal.opened && (props.config.staffOverLimit * 1) && !_.includes(pathname, '/admin/panel/staff/staff-members') && !_.includes(pathname, '/admin/panel/staff/view-staff')) {
            this.openStaffLimitModal();
        }
    }

    isPathAvailableForStaff(props) {
        let pathForLevel2 = _.findIndex(level2Paths, path => _.includes(props.location.pathname, path)) !== -1;
        let pathForLevel3 = _.findIndex(level3Paths, path => _.includes(props.location.pathname, path)) !== -1;

        if (props.session.userLevel === 1) {
            return !pathForLevel2 && !pathForLevel3;
        }

        if (props.session.userLevel === 2) {
            return !pathForLevel3;
        }

        return true;
    }

    openStaffLimitModal() {
        let redirection = () => {
            ModalContainer.closeModal();

            if(this.props.session.userLevel < 3) {
                this.props.dispatch(SessionActions.logout());
            } else {
                this.context.router.push('/admin/panel/staff/staff-members');
            }
        };

        ModalContainer.openModal(
            <div className="application__staff-limit">
                <Message title={i18n('STAFF_LIMIT_EXCEEDED')} type="error">
                    {i18n('STAFF_LIMIT_EXCEEDED_DESCRIPTION', {staffLimit: this.props.config.staffLimit})}
                </Message>
                <div className="application__staff-limit-button">
                    <Button onClick={redirection}>OK</Button>
                </div>
            </div>
        );

    }
}

export default connect((store) => {
    return {
        config: store.config,
        modal: store.modal,
        session: store.session,
        routing: store.routing
    };
})(App);
