// MOCKS
const ValidationFactoryMock = require('lib-app/__mocks__/validations/validation-factory-mock');
const FormField = ReactMock();

// COMPONENT
const Form = requireUnit('core-components/form', {
    'lib-app/validations/validator-factory': ValidationFactoryMock,
    'core-components/form-field': FormField,
});

describe('Form component', function () {
    let form, fields, onSubmit = stub();

    function renderForm(props = {}) {
        form = TestUtils.renderIntoDocument(
            <Form {...props} onSubmit={onSubmit}>
                <div>
                    <FormField name="first" value="value1" required/>
                    <FormField name="second" value="value2" required validation="CUSTOM"/>
                </div>
                <FormField name="third" value="value3" />
            </Form>
        );
        fields = TestUtils.scryRenderedComponentsWithType(form, FormField);
    }

    function resetStubs() {
        ValidationFactoryMock.validators.defaultValidatorMock.performValidation = stub();
        ValidationFactoryMock.validators.customValidatorMock.performValidation = stub();
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
            ValidationFactoryMock.validators.defaultValidatorMock.performValidation = stub().returns('MOCK_ERROR');
            ValidationFactoryMock.validators.customValidatorMock.performValidation = stub().returns('MOCK_ERROR_2');
            expect(fields[0].props.error).to.equal(undefined);
            expect(fields[0].props.error).to.equal(undefined);
            expect(fields[0].props.error).to.equal(undefined);

            fields[0].props.onBlur();
            expect(fields[0].props.error).to.equal('MOCK_ERROR');

            fields[1].props.onBlur();
            expect(fields[1].props.error).to.equal('MOCK_ERROR_2');

            fields[2].props.onBlur();
            expect(fields[2].props.error).to.equal(undefined);
        });
    });

    describe('when using controlled errors', function () {
        let onValidateErrors;

        beforeEach(function () {
            onValidateErrors = stub();

            ValidationFactoryMock.validators.defaultValidatorMock.performValidation = stub().returns('MOCK_ERROR');
            ValidationFactoryMock.validators.customValidatorMock.performValidation = stub().returns('MOCK_ERROR_2');

            renderForm({
                errors: {first: 'MOCK_ERROR_CONTROLLED'},
                onValidateErrors: onValidateErrors
            });
        });
        afterEach(resetStubs);

        it('should pass the errors to fields', function () {
            expect(fields[0].props.error).to.equal('MOCK_ERROR_CONTROLLED');
            expect(fields[1].props.error).to.equal(undefined);
        });

        it('should prioritize prop error over state error', function () {
            fields[1].props.onBlur();
            expect(fields[1].props.error).to.equal(undefined);
        });

        it('should call onValidateErrors when state changes', function () {
            fields[1].props.onBlur();
            expect(onValidateErrors).to.have.been.calledWith({second: 'MOCK_ERROR_2'});

        });

        it('should still working if the error prop changes', function () {
            function setErrorsOrRender(errors = {}) {
                form = reRenderIntoDocument(
                    <Form errors={errors}>
                        <div>
                            <FormField name="first" value="value1" required/>
                            <FormField name="second" value="value2" required validation="CUSTOM"/>
                        </div>
                        <FormField name="third" value="value3" />
                    </Form>
                );
                fields = TestUtils.scryRenderedComponentsWithType(form, FormField);
            }

            setErrorsOrRender();
            expect(fields[0].props.error).to.equal(undefined);
            expect(fields[1].props.error).to.equal(undefined);

            setErrorsOrRender({second: 'MOCK_ERROR_CONTROLLED_2'});
            expect(fields[0].props.error).to.equal(undefined);
            expect(fields[1].props.error).to.equal('MOCK_ERROR_CONTROLLED_2');

            setErrorsOrRender({first: 'MOCK_ERROR_CONTROLLED', second: 'MOCK_ERROR_CONTROLLED_2'});
            expect(fields[0].props.error).to.equal('MOCK_ERROR_CONTROLLED');
            expect(fields[1].props.error).to.equal('MOCK_ERROR_CONTROLLED_2');
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
            ValidationFactoryMock.validators.defaultValidatorMock.performValidation = stub().returns('MOCK_ERROR');
            ValidationFactoryMock.validators.customValidatorMock.performValidation = stub().returns('MOCK_ERROR_2');
            fields[0].focus = spy(fields[0].focus);
            fields[1].focus = spy(fields[1].focus);

            TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));

            expect(fields[0].props.error).to.equal('MOCK_ERROR');
            expect(fields[1].props.error).to.equal('MOCK_ERROR_2');
            expect(fields[2].props.error).to.equal(undefined);
            expect(form.props.onSubmit).to.not.have.been.called;
        });

        it('should focus the first field with error', function () {
            ValidationFactoryMock.validators.defaultValidatorMock.performValidation = stub().returns('MOCK_ERROR');
            ValidationFactoryMock.validators.customValidatorMock.performValidation = stub().returns('MOCK_ERROR_2');
            fields[0].focus = spy(fields[0].focus);
            fields[1].focus = spy(fields[1].focus);

            TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));
            expect(fields[0].focus).to.have.been.called;

            ValidationFactoryMock.validators.defaultValidatorMock.performValidation = stub();
            fields[0].focus.reset();
            fields[1].focus.reset();

            TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));
            expect(fields[0].focus).to.not.have.been.called;
            expect(fields[1].focus).to.have.been.called;
        });
    });

    describe('when using loading prop', function () {
        it('should pass loading context in true if enabled', function () {
            renderForm({ loading: true });

            expect(fields[0].context.loading).to.equal(true);
            expect(fields[1].context.loading).to.equal(true);
            expect(fields[2].context.loading).to.equal(true);
        });

        it('should pass loading context in true if disabled', function () {
            renderForm({ loading: false });

            expect(fields[0].context.loading).to.equal(false);
            expect(fields[1].context.loading).to.equal(false);
            expect(fields[2].context.loading).to.equal(false);
        });
    });
});
