import React              from 'react/addons';
import {ListenerMixin}    from 'reflux';
import {RouteHandler}     from 'react-router';

import MainHomePageLoginWidget  from 'app/main/main-home/main-home-page-login-widget';

var MainHomePage = React.createClass({

	render() {
		return (
			<div className="main-home-page">
				<MainHomePageLoginWidget />
			</div>
		);
	}
});

export default MainHomePage;