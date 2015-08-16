jest.dontMock('../Footer.js');

import React from 'react/addons';
import Footer from '../Footer.js';
var TestUtils = React.addons.TestUtils;

describe('Footer', () => {
	it('should 2 equal 2', () => {
		var footer = TestUtils.renderIntoDocument(
			<Footer />
		);
		var label = TestUtils.findRenderedDOMComponentWithTag(
			footer, 'footer');

		expect(label.getDOMNode().textContent).toEqual('Footer');
	});
});