// MOCKS
const ValidationFactoryMock = require('lib-app/__mocks__/validations/validation-factory-mock');
const Input = ReactMock();

// COMPONENTS
const Form = requireUnit('core-components/form', {
    'lib-app/validations/validations-factory': ValidationFactoryMock,
    'core-components/input': Input
});

describe('Form component', function () {
    let form, fields, onSubmit = stub();

    function renderForm() {
        form = TestUtils.renderIntoDocument(
            <Form onSubmit={onSubmit}>
                <div>
                    <Input name="first" value="value1" required/>
                    <Input name="second" value="value2" required validation="CUSTOM"/>
                </div>
                <Input name="third" value="value3" />
            </Form>
        );
        fields = TestUtils.scryRenderedComponentsWithType(form, Input);
    }

    function resetStubs() {
        ValidationFactoryMock.validators.defaultValidatorMock.validate = stub();
        ValidationFactoryMock.validators.customValidatorMock.validate = stub();
        ValidationFactoryMock.getValidator.reset();
        onSubmit.reset();
    }

    describe('when mounting the form', function () {
        beforeEach(renderForm);
        afterEach(resetStubs);

        it('should store fields values in form state', function () {
            expect(form.state.form).to.deep.equal({
                first: 'value1',
                second: 'value2',
                third: 'value3'
            });
        });

        it('should set validations for required fields', function () {
            expect(ValidationFactoryMock.getValidator).to.have.been.calledWith('DEFAULT');
            expect(ValidationFactoryMock.getValidator).to.have.been.calledWith('CUSTOM');
            expect(ValidationFactoryMock.getValidator).to.have.been.calledTwice;

            expect(form.state.validations).to.deep.equal({
                first: ValidationFactoryMock.validators.defaultValidatorMock,
                second: ValidationFactoryMock.validators.customValidatorMock
            });
        });
    });

    describe('when interacting with fields', function () {
        beforeEach(renderForm);
        afterEach(resetStubs);

        it('should update form state if a field value changes', function () {
            fields[0].props.onChange({ target: {value: 'value4'}});

            expect(form.state.form).to.deep.equal({
                first: 'value4',
                second: 'value2',
                third: 'value3'
            });
        });

        it('should update field value if state value changes', function () {
            form.setState({
                form: {
                    first: 'value6',
                    second: 'value7',
                    third: 'value8'
                }
            });

            expect(fields[0].props.value).to.equal('value6');
            expect(fields[1].props.value).to.equal('value7');
            expect(fields[2].props.value).to.equal('value8');
        });

        it('should validate required fields when blurring', function () {
            ValidationFactoryMock.validators.defaultValidatorMock.validate = stub().returns('MOCK_ERROR');
            ValidationFactoryMock.validators.customValidatorMock.validate = stub().returns('MOCK_ERROR_2');
            expect(fields[0].props.error).to.equal(undefined);
            expect(fields[0].props.error).to.equal(undefined);
            expect(fields[0].props.error).to.equal(undefined);

            TestUtils.Simulate.blur(ReactDOM.findDOMNode(fields[0]));
            expect(fields[0].props.error).to.equal('MOCK_ERROR');

            TestUtils.Simulate.blur(ReactDOM.findDOMNode(fields[1]));
            expect(fields[1].props.error).to.equal('MOCK_ERROR_2');

            TestUtils.Simulate.blur(ReactDOM.findDOMNode(fields[2]));
            expect(fields[2].props.error).to.equal(undefined);
        });
    });

    describe('when submitting the form', function () {
        beforeEach(renderForm);
        afterEach(resetStubs);

        it('should call onSubmit callback', function () {
            TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));

            expect(form.props.onSubmit).to.have.been.calledWith(form.state.form);
        });

        it('should validate all fields and not call onSubmit if there are errors', function () {
            ValidationFactoryMock.validators.defaultValidatorMock.validate = stub().returns('MOCK_ERROR');
            ValidationFactoryMock.validators.customValidatorMock.validate = stub().returns('MOCK_ERROR_2');
            fields[0].focus = spy(fields[0].focus);
            fields[1].focus = spy(fields[1].focus);

            TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));

            expect(fields[0].props.error).to.equal('MOCK_ERROR');
            expect(fields[1].props.error).to.equal('MOCK_ERROR_2');
            expect(fields[2].props.error).to.equal(undefined);
            expect(form.props.onSubmit).to.not.have.been.called;
        });

        it('should focus the first field with error', function () {
            ValidationFactoryMock.validators.defaultValidatorMock.validate = stub().returns('MOCK_ERROR');
            ValidationFactoryMock.validators.customValidatorMock.validate = stub().returns('MOCK_ERROR_2');
            fields[0].focus = spy(fields[0].focus);
            fields[1].focus = spy(fields[1].focus);

            TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));
            expect(fields[0].focus).to.have.been.called;

            ValidationFactoryMock.validators.defaultValidatorMock.validate = stub();
            fields[0].focus.reset();
            fields[1].focus.reset();

            TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));
            expect(fields[0].focus).to.not.have.been.called;
            expect(fields[1].focus).to.have.been.called;
        });
    });
});
