import React              from 'react/addons';
import {ListenerMixin}    from 'reflux';
import {RouteHandler}     from 'react-router';

var MainLayout = React.createClass({

	render() {
		return (
			<div>

				MainHeader

				<RouteHandler params={this.props.params}
					query={this.props.query} />

				MainFooter

			</div>
		);
	}
});

export default MainLayout;