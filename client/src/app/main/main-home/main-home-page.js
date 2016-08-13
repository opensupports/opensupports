import React from 'react';

import MainHomePageLoginWidget from 'app/main/main-home/main-home-page-login-widget';
import MainHomePagePortal      from 'app/main/main-home/main-home-page-portal';

class MainHomePage extends React.Component {
	
	render() {
		return (
			<div className="main-home-page">
				<MainHomePageLoginWidget className="col-md-4" />
				<MainHomePagePortal className="col-md-8" />
			</div>
		);
	}
}

export default MainHomePage;