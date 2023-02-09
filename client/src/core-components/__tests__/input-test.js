const Input = require('core-components/input');

describe('Input component', function () {

    let nativeInput, input;

    function renderInput(props) {
        input = TestUtils.renderIntoDocument(
            <Input {...props} />
        );
        nativeInput = TestUtils.findRenderedDOMComponentWithTag(input, 'input');
    }

    describe('when passing props that affects the native input', function () {

        it('should render type text if it has not specified type', function () {
            renderInput();

            expect(nativeInput.getAttribute('type')).to.equal('text');
        });

        it('should render type password if password pass is passed', function () {
            renderInput({
                password: true
            });

            expect(nativeInput.getAttribute('type')).to.equal('password');
        });

        it('should render aria-required instead of required', function () {
            renderInput({
                required: true
            });

            expect(nativeInput.getAttribute('required')).to.not.equal('null');
            expect(nativeInput.getAttribute('aria-required')).to.equal('true');
        });
    });
});
