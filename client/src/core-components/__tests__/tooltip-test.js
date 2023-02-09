const Tooltip = require('core-components/tooltip');

describe('Tooltip component', function () {
    it('should open and close with click', function () {
        let tooltip = TestUtils.renderIntoDocument(
            <Tooltip content="hola">
                <span className="clickeable">text to click</span>
            </Tooltip>
        );
        let clickeable = TestUtils.scryRenderedDOMComponentsWithClass(tooltip, 'clickeable')[0];
        let content = TestUtils.scryRenderedDOMComponentsWithClass(tooltip, 'tooltip__message');

        expect(content.length).to.equal(0);

        TestUtils.Simulate.click(clickeable);

        content = TestUtils.scryRenderedDOMComponentsWithClass(tooltip, 'tooltip__message');
        expect(content.length).to.equal(1);
        expect(content[0].textContent).to.equal('hola');

        TestUtils.Simulate.click(clickeable);

        content = TestUtils.scryRenderedDOMComponentsWithClass(tooltip, 'tooltip__message');
        expect(content.length).to.equal(0);
    });

    it('should open and close with hover', function () {
        let tooltip = TestUtils.renderIntoDocument(
            <Tooltip content="hola" openOnHover>
                <span className="to-hovering">text</span>
            </Tooltip>
        );
        let hovereable = TestUtils.scryRenderedDOMComponentsWithClass(tooltip, 'to-hovering')[0];
        let content = TestUtils.scryRenderedDOMComponentsWithClass(tooltip, 'tooltip__message');

        expect(content.length).to.equal(0);

        TestUtils.Simulate.mouseOver(hovereable);
        content = TestUtils.scryRenderedDOMComponentsWithClass(tooltip, 'tooltip__message');

        expect(content.length).to.equal(1);
        expect(content[0].textContent).to.equal('hola');

        TestUtils.Simulate.mouseOut(hovereable);
        content = TestUtils.scryRenderedDOMComponentsWithClass(tooltip, 'tooltip__message');

        expect(content.length).to.equal(0);
    });
});
