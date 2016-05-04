const Form = require('core-components/form');
const Input = require('core-components/input');

describe('Form component', function () {
    let form, inputs, onSubmit = stub();

    beforeEach(function () {
        form = TestUtils.renderIntoDocument(
            <Form onSubmit={onSubmit}>
                <div>
                    <Input name="first" value="value1"/>
                    <Input name="second" value="value2" />
                </div>
                <Input name="third" value="value3" />
            </Form>
        );
        inputs = TestUtils.scryRenderedComponentsWithType(form, Input);
    });

    it('should store input value in form state', function () {
        expect(form.state.form).to.deep.equal({
            first: 'value1',
            second: 'value2',
            third: 'value3'
        });
    });

    it('should update form state if an input value changes', function () {
        inputs[0].props.onChange({ target: {value: 'value4'}});

        expect(form.state.form).to.deep.equal({
            first: 'value4',
            second: 'value2',
            third: 'value3'
        });
    });

    it('should update input value if state value changes', function () {
        form.setState({
            form: {
                first: 'value6',
                second: 'value7',
                third: 'value8'
            }
        });

        expect(inputs[0].props.value).to.equal('value6');
        expect(inputs[1].props.value).to.equal('value7');
        expect(inputs[2].props.value).to.equal('value8');
    });

    it('should call onSubmit callback when form is submitted', function () {
        TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));

        expect(form.props.onSubmit).to.have.been.calledWith(form.state.form);
    });
});
