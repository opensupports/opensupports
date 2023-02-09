import React              from 'react';
import _                  from 'lodash';
import classNames         from 'classnames';
import { connect }        from 'react-redux'
import DocumentTitle      from 'react-document-title';

import history from 'lib-app/history';
import ModalContainer from 'app-components/modal-container';

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
            'application_mandatory-login': (this.props.config['mandatory-login'])
        };

        return classNames(classes);
    }

    redirectIfPathIsNotValid(props) {
        const validations = {
            languageChanged: props.config.language !== this.props.config.language,
            loggedIn: !_.includes(props.location.pathname, '/dashboard') && props.session.logged,
            loggedOut: _.includes(props.location.pathname, '/dashboard') && !props.session.logged,
            loggedInStaff: !_.includes(props.location.pathname, '/admin/panel') && props.session.logged && props.session.staff,
            loggedOutStaff: _.includes(props.location.pathname, '/admin/panel') && !props.session.logged
        };

        if(props.config['maintenance-mode'] && !_.includes(props.location.pathname, '/admin') && !_.includes(props.location.pathname, '/maintenance')) {
            history.push('/maintenance');
        }

        if(!props.config['maintenance-mode'] && _.includes(props.location.pathname, '/maintenance')) {
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

        if (!props.config.registration && _.includes(props.location.pathname, 'signup')) {
            history.push('/');
        }

        if(props.config['mandatory-login'] && _.includes(props.location.pathname, '/check-ticket')) {
            history.push('/');
        }

        if(props.config.installedDone && !props.config.installed && !_.includes(props.location.pathname, '/install')) {
            history.push('/install');
        }

        if(props.config.installedDone && props.config.installed && _.includes(props.location.pathname, '/install')) {
            history.push('/admin');
        }

        if(process.env.NODE_ENV === 'production' && _.includes(props.location.pathname, '/components-demo')) {
            history.push('/');
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
}

export default connect((store) => {
    return {
        config: store.config,
        modal: store.modal,
        session: store.session,
        routing: store.routing
    };
})(App);
