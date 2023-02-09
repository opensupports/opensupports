let Button = require('core-components/button');

describe('Button component', function () {

    it('should render children correctly', function () {

        let button = TestUtils.renderIntoDocument(
            <Button>test content</Button>
        );

        expect(ReactDOM.findDOMNode(button).textContent).to.eql('test content');
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
                    test content
                </Button>
            );

            expect(ReactDOM.findDOMNode(button).getAttribute('class')).to.include('button_' + type);
        });
    });
});
