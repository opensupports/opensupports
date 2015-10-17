'use strict';

import React         from 'react/addons';
import {Link}        from 'react-router';
import DocumentTitle from 'react-document-title';

import Button           from 'core-components/button';
import Input            from 'core-components/input';
import Checkbox         from 'core-components/checkbox';
import Widget           from 'core-components/widget';
import DropDown         from 'core-components/drop-down';

var dropDownItems = ['English', 'Spanish', 'German', 'Portuguese', 'Japanese'];

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
            title: 'Input',
            render: (
                <Input placeholder="placeholder"/>
            )
        },
        {
            title: 'Input wrapped in a label',
            render: (
                <Input placeholder="placeholder" label="This is a label" />
            )
        },
        {
            title: 'Checkbox',
            render: (
                <Checkbox label="Remember me" />
            )
        },
        {
            title: 'Widget',
            render: (
                <Widget style={{ width: 324 }}>
                    <h2>Register here!</h2>

                    <Button type="primary">SIGN UP</Button>
                </Widget>
            )
        },
        {
            title: 'DropDown',
            render: (
                <DropDown items={dropDownItems} />
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