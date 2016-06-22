'use strict';

const React = require('react');
const DocumentTitle = require('react-document-title');

const Button = require('core-components/button');
const Input = require('core-components/input');
const Checkbox = require('core-components/checkbox');
const Widget = require('core-components/widget');
const DropDown = require('core-components/drop-down');
const Menu = require('core-components/menu');

let dropDownItems = [{content: 'English'}, {content: 'Spanish'}, {content: 'German'}, {content: 'Portuguese'}, {content: 'Japanese'}];
let secondaryMenuItems = [
    {content: 'My Tickets', icon: 'file-text'},
    {content: 'New Ticket', icon: 'plus'},
    {content: 'Articles', icon: 'book'},
    {content: 'Edit Profile', icon: 'pencil'},
    {content: 'Close Session', icon: 'lock'}
];

let DemoPage = React.createClass({

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
                <DropDown items={dropDownItems} onChange={function (index) { console.log('changed to ' + index); }} />
            )
        },
        {
            title: 'Primary Menu',
            render: (
                <Menu items={dropDownItems} />
            )
        },
        {
            title: 'Secondary Menu',
            render: (
                <Menu items={secondaryMenuItems} type="secondary"/>
            )
        }
	],

	render() {
		return (
			<DocumentTitle title="Demo Page">
				<section className="demo-page">
					{this.renderElements()}
				</section>
			</DocumentTitle>
		);
	},

	renderElements: function () {
		return this.elements.map((element) => {
			return (
				<div className="demo-element col-md-3">
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