import React from 'react';

import MainHomePageLoginWidget from 'app/main/main-home/main-home-page-login-widget';
import MainHomePagePortal      from 'app/main/main-home/main-home-page-portal';

import CommonActions from 'actions/common-actions';
import UserStore     from 'stores/user-store';

const MainHomePage = React.createClass({

	componentWillMount() {
		if (UserStore.isLoggedIn()) {
			CommonActions.logged();
		}
	},
	
	render() {
		return (
			<div className="main-home-page">
				<MainHomePageLoginWidget className="col-md-4" />
				<MainHomePagePortal className="col-md-8" />
			</div>
		);
	}
});

export default MainHomePage;