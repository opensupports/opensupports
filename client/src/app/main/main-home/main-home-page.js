const React = require( 'react');

const MainHomePageLoginWidget  = require('app/main/main-home/main-home-page-login-widget');
const MainHomePagePortal  = require('app/main/main-home/main-home-page-portal');

const MainHomePage = React.createClass({

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