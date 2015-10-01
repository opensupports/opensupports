import React              from 'react/addons';
import Reflux             from 'reflux';
import {ListenerMixin}    from 'reflux';
import {RouteHandler}     from 'react-router';

import CommonActions      from 'actions/common-actions';
import CommonStore        from 'stores/common-store';

var App = React.createClass({

    mixins: [Reflux.listenTo(CommonStore, 'onCommonStoreChanged')],

    render() {
        return (
          <div>
            <RouteHandler params={this.props.params}
                          query={this.props.query} />
          </div>
        );
    },

    onCommonStoreChanged(change) {
        if (change === 'i18n') {
            this.forceUpdate();
        }
    }

});

export default App;