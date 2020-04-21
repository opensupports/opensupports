'use strict';

const React = require('react');
// const LineChart = require("react-chartjs-2").Line;
const _ = require('lodash');
const DocumentTitle = require('react-document-title');

const ModalContainer = require('app-components/modal-container');
const AreYouSure = require('app-components/are-you-sure');

const Button = require('core-components/button');
const Input = require('core-components/input');
const Checkbox = require('core-components/checkbox');
const Widget = require('core-components/widget');
const DropDown = require('core-components/drop-down');
const Menu = require('core-components/menu');
const Tooltip = require('core-components/tooltip');
const Table = require('core-components/table');
const InfoTooltip = require('core-components/info-tooltip');
const TagSelector = require('core-components/tag-selector');

function rand(min, max, num) {
    var rtn = [];
    while (rtn.length < num) {
        rtn.push((Math.random() * (max - min)) + min);
    }
    return rtn;
}

let chartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
        {
            label: "My Second dataset",
            fill: false,
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            borderWidth: 3,
            data: rand(32, 100, 6),
            pointRadius: 0
        },
        {
            label: "My Second dataset",
            fill: false,
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            borderWidth: 3,
            data: rand(32, 100, 6)
        }
    ]
};
let chartOptions = {};
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
            title: 'Tag selector',
            render: (
                <TagSelector
                    items={[
                        {name: 'tag1', color: 'blue'},
                        {name: 'suggestion', color: '#ff6900'},
                        {name: 'tag3', color: 'red'},
                        {name: 'tag4', color: 'green'},
                        {name: 'bug', color: '#eb144c'},
                    ]}
                    values={['suggestion','bug', 'tag4']}
                    onRemoveClick={(e)  => console.log('deleted click', e)}
                    onTagSelected={(e)  => console.log('selected click', e)}
                />
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
            title: 'Navigation Menu',
            render: (
                <Menu items={secondaryMenuItems} type="navigation"/>
            )
        },
        {
            title: 'Horizontal Menu',
            render: (
                <Menu items={secondaryMenuItems.slice(0, 3)} type="horizontal"/>
            )
        },
        {
            title: 'HorizontalList Menu',
            render: (
                <Menu items={dropDownItems.slice(0, 3)} type="horizontal-list"/>
            )
        },
        {
            title: 'DropDown',
            render: (
                <DropDown items={dropDownItems} onChange={function (index) { console.log('changed to ' + index); }} />
            )
        },
        {
            title: 'Tooltip',
            render: (
                <div>
                    <Tooltip content="mensaje mensa jemensajemens ajem ensaje  nsaje adicionals">
                        hola
                    </Tooltip>
                </div>
            )
        },
        {
            title: 'ModalTrigger',
            render: (
                <Button onClick={function () {
                    AreYouSure.openModal('I confirm I want to perform this action.', ()=> {alert('yes');}, 'secure')
                }}>
                    Open Modal
                </Button>
            )
        },
        {
            title: 'ModalTrigger Large',
            render: (
                <Button onClick={function () {
                    ModalContainer.openModal(
                        <div>
                            {_.range(1, 60).map(() => <div>Some modal content</div>)}
                        </div>
                    );
                }}>
                    Open Large Modal
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
                    {title1: 'Row1', title2: 'Example', n: 1},
                    {title1: 'Row2', title2: 'Example', n: 2},
                    {title1: 'Row3', title2: 'Example', n: 3},
                    {title1: 'Row4', title2: 'Example', n: 4},
                    {title1: 'Row5', title2: 'Example', n: 5},
                    {title1: 'Row6', title2: 'Example', n: 6},
                    {title1: 'Row7', title2: 'Example', n: 7},
                    {title1: 'Row8', title2: 'Example', n: 8},
                    {title1: 'Row9', title2: 'Example', n: 9},
                    {title1: 'Row10', title2: 'Example', n: 10},
                    {title1: 'Row11', title2: 'Example', n: 11},
                    {title1: 'Row12', title2: 'Example', n: 12},
                    {title1: 'Row13', title2: 'Example', n: 13},
                    {title1: 'Row14', title2: 'Example', n: 14}
                ]} pageSize={3} comp={function (a, b) {
                    let ans = 0;
                    if(a.title1 < b.title1)
                        ans = -1;
                    else if(a.title1 > b.title1)
                        ans = 1;
                    return ans;
                }}/>
            )
        },
        {
            title: 'InfoTooltip',
            render: (
                <InfoTooltip type="warning" text="No staff member is assigned to this department." />
            )
        },
        {
            title: 'LineChart',
            // render: (
            //     <LineChart data={chartData} options={chartOptions} width="600" height="250" />
            // ),
            render: (
                null
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