/**
 * Created by ivan on 16/08/15.
 */
jest.dontMock('../button.js');

import React from 'react/addons';
import Button from '../button.js';
var TestUtils = React.addons.TestUtils;

describe('Button', () => {
	it('should render children', () => {
		var button = TestUtils.renderIntoDocument(
			<Button>
				testcontent
			</Button>
		);

		expect(button.getDOMNode().textContent).toEqual('testcontent');
	});

	it('should add passed types to class', () => {
		var types = [
			'primary'
		];

		types.forEach((type) => {
			var button = TestUtils.renderIntoDocument(
				<Button type={type}>
					testcontent
				</Button>
			);
			expect(button.getDOMNode().getAttribute('class')).toContain('button-' + type);
		});
	});
});