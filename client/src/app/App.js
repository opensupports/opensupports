import React              from 'react';
import _                  from 'lodash';
import classNames         from 'classnames';
import { connect }        from 'react-redux'
import { browserHistory } from 'react-router';

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
          <div className={this.getClass()}>
              <div className="application__content">
                {React.cloneElement(this.props.children, {})}
              </div>
              <ModalContainer />
          </div>
        );
    }

    getClass() {
        let classes = {
            'application': true,
            'application_modal-opened': (this.props.modal.opened)
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
            browserHistory.push('/maintenance');
        }

        if(!props.config['maintenance-mode'] && _.includes(props.location.pathname, '/maintenance')) {
            browserHistory.push('/');
        }

        if (validations.languageChanged) {
            browserHistory.push(props.location.pathname);
        }

        if (validations.loggedOut) {
            browserHistory.push('/');
        }

        if (validations.loggedOutStaff) {
            browserHistory.push('/admin');
        }

        if (validations.loggedIn && !props.session.staff) {
            browserHistory.push('/dashboard');
        } else if(validations.loggedInStaff) {
            browserHistory.push('/admin/panel');
        }

        if (this.props.session.userLevel && !this.isPathAvailableForStaff()) {
            browserHistory.push('/admin/panel');
        }
    }

    isPathAvailableForStaff() {
        let pathForLevel2 = _.findIndex(level2Paths, path => _.includes(this.props.location.pathname, path)) !== -1;
        let pathForLevel3 = _.findIndex(level3Paths, path => _.includes(this.props.location.pathname, path)) !== -1;

        if (this.props.session.userLevel === 1) {
            return !pathForLevel2 && !pathForLevel3;
        }

        if (this.props.session.userLevel === 2) {
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