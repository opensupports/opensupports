import React              from 'react';
import _                  from 'lodash';
import { connect }        from 'react-redux'
import { browserHistory } from 'react-router';

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
          <div>
              {React.cloneElement(this.props.children, {})}
          </div>
        );
    }

    redirectIfPathIsNotValid(props) {
        const validations = {
            languageChanged: props.config.language !== this.props.config.language,
            loggedIn: !_.includes(props.location.pathname, '/dashboard') && props.session.logged,
            loggedOut: _.includes(props.location.pathname, '/dashboard') && !props.session.logged
        };

        if (validations.languageChanged) {
            browserHistory.push(props.location.pathname);
        }

        if (validations.loggedOut) {
            browserHistory.push('/');
        }

        if (validations.loggedIn) {
            browserHistory.push('/dashboard');
        }
    }
}

export default connect((store) => {
    return {
        config: store.config,
        session: store.session,
        routing: store.routing
    };
})(App);