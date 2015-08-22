import React              from 'react/addons';
import {ListenerMixin}    from 'reflux';
import {RouteHandler}     from 'react-router';

var App = React.createClass({

  render() {
    return (
      <div>
        <RouteHandler params={this.props.params}
                      query={this.props.query} />
      </div>
    );
  }

});

export default App;