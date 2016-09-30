const Tooltip = require('core-components/tooltip');

describe('Tooltip component', function () {
    it('should open and close with click', function () {
        let tooltip = TestUtils.renderIntoDocument(
            <Tooltip content="hola"><span className="clickeable">text to click</span></Tooltip>
        );
    });
});
