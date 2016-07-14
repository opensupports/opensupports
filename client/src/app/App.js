import React              from 'react';
import Reflux             from 'reflux';

import CommonStore        from 'stores/common-store';

let App = React.createClass({

    contextTypes: {
        router: React.PropTypes.object
    },

    mixins: [Reflux.listenTo(CommonStore, 'onCommonStoreChanged')],

    render() {
        return (
          <div>
              {React.cloneElement(this.props.children, {})}
          </div>
        );
    },

    onCommonStoreChanged(change) {
        let handle = {
            'i18n': () => {this.forceUpdate()},
            'logged': () => {this.context.router.push('/app/dashboard')},
            'loggedOut': () => {this.context.router.push('/app')}
        };

        if (handle[change]) {
            handle[change]();
        }
    }
});

export default App;
