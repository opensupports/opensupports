'use strict';

const React = require('react');
const DocumentTitle = require('react-document-title');

const ModalContainer = require('app/modal-container');
const AreYouSure = require('app-components/are-you-sure');

const Button = require('core-components/button');
const Input = require('core-components/input');
const Checkbox = require('core-components/checkbox');
const Widget = require('core-components/widget');
const DropDown = require('core-components/drop-down');
const Menu = require('core-components/menu');
const Tooltip = require('core-components/tooltip');
const Table = require('core-components/table');

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
                <Input placeholder="placeholder" error="No anda"/>
            )
        },
        {
            title: 'Input wrapped in a label',
            render: (
                <Input placeholder="placeholder" label="This is a label" icon="user"/>
            )
        },
        {
            title: 'Checkbox',
            render: (
                <Checkbox label="Remember me" value={true} />
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
        },
        {
            title: 'Tooltip',
            render: (
                <div>
                    <Tooltip content="mensaje mensa jemensajemens ajem ensaje  nsaje adicionals" openOnHover={true}>
                        hola
                    </Tooltip>
                </div>
            )
        },
        {
            title: 'ModalTrigger',
            render: (
                <Button onClick={function () {
                    ModalContainer.openModal(
                        <AreYouSure description="I confirm I want to perform this action." onYes={()=> {alert('yes');}} />
                    );
                }}>
                    Open Modal
                </Button>
            )
        },
        {
            title: 'Table',
            render: (
                <Table headers={[
                    {value:'Title First', key: 'title1'},
                    {value:'Title Second', key: 'title2'}
                ]} rows={[
                    {title1: 'Row1', title2: 'Example'},
                    {title1: 'Row2', title2: 'Example'},
                    {title1: 'Row3', title2: 'Example'},
                    {title1: 'Row4', title2: 'Example'},
                    {title1: 'Row5', title2: 'Example'},
                    {title1: 'Row6', title2: 'Example'},
                    {title1: 'Row7', title2: 'Example'},
                    {title1: 'Row8', title2: 'Example'},
                    {title1: 'Row9', title2: 'Example'},
                    {title1: 'Row10', title2: 'Example'},
                    {title1: 'Row11', title2: 'Example'},
                    {title1: 'Row12', title2: 'Example'},
                    {title1: 'Row13', title2: 'Example'},
                    {title1: 'Row14', title2: 'Example'}
                ]} pageSize={3}/>
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
				<div className="demo-element col-md-4">
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