import React              from 'react';
import _                  from 'lodash';
import { connect }        from 'react-redux'

class App extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object,
        location: React.PropTypes.object
    };

    constructor(props, context) {
        super(props, context);

        if (_.includes(props.location.pathname, '/app/dashboard') && !props.config.logged) {
            context.router.push('/app');
        }

        if (!_.includes(props.location.pathname, '/app/dashboard') && props.config.logged) {
            context.router.push('/app/dashboard');
        }
    }

    componentWillReceiveProps(nextProps) {
        const validations = {
            languageChanged: nextProps.config.language !== this.props.config.language,
            loggedIn: nextProps.session.logged && !this.props.session.logged,
            loggedOut: !nextProps.session.logged && this.props.session.logged
        };

        if (validations.languageChanged) {
            this.context.router.push(this.props.location.pathname);
        }

        if (validations.loggedIn) {
            this.context.router.push('/app/dashboard');
        }

        if (validations.loggedOut) {
            this.context.router.push('/app');
        }
    }

    render() {
        return (
          <div>
              {React.cloneElement(this.props.children, {})}
          </div>
        );
    }
}

export default connect((store) => {
    return {
        config: store.config,
        session: store.session,
        routing: store.routing
    };
})(App);