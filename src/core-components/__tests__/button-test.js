jest.dontMock('../button.js');

import React from 'react/addons';
import Button from '../button.js';

let TestUtils = React.addons.TestUtils;

describe('Button', function () {
    it('should render children', function () {
        let button = TestUtils.renderIntoDocument(
            <Button>
                testcontent
            </Button>
        );

        expect(button.getDOMNode().textContent).toEqual('testcontent');
    });

    it('should add passed types to class', function () {
        let types = [
            'primary',
            'clean',
            'link'
        ];

        types.forEach(function (type) {
            let button = TestUtils.renderIntoDocument(
                <Button type={type}>
                    testcontent
                </Button>
            );

            expect(button.getDOMNode().getAttribute('class')).toContain('button-' + type);
        });
    });
});
