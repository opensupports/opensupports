'use strict';

import React         from 'react/addons';
import {Link}        from 'react-router';
import DocumentTitle from 'react-document-title';

import Button from '../components-core/button.js';
import Widget from '../components-core/widget.js';

var DemoPage = React.createClass({

	propTypes: {
		currentUser: React.PropTypes.object.isRequired
	},

	elements: [
		{
			title: 'Primary Button',
			render: (
				<Button type="primary">Sign up</Button>
			)
		},
		{
			title: 'Widget',
			render: (
				<Widget>
					<h2>Register here!</h2>

					<Button type="primary">SIGN UP</Button>
				</Widget>
			)
		}
	],

	render() {
		return (
			<DocumentTitle title="Demo Page">
				<section className="home-page">
					{this.renderElements()}
				</section>
			</DocumentTitle>
		);
	},

	renderElements: function () {
		return this.elements.map((element) => {
			return (
			<div className="demo-element">
				<h4>
					{element.title}
				</h4>
				<div class="demo-element--example">
					{element.render}
				</div>
			</div>
			);
		});
	}
});

export default DemoPage;