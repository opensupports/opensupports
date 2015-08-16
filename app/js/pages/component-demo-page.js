'use strict';

import React         from 'react/addons';
import {Link}        from 'react-router';
import DocumentTitle from 'react-document-title';

import Footer        from '../components/Footer.js';

var HomePage = React.createClass({

	propTypes: {
		currentUser: React.PropTypes.object.isRequired
	},

	render() {
		return (
			<DocumentTitle title="Demo Page">
				<section className="home-page">

					<div>
						FooterDemo
					</div>

					<div>
						<Footer />
					</div>

				</section>
			</DocumentTitle>
		);
	}

});

export default HomePage;