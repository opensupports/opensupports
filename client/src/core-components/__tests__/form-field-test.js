const Input = ReactMock();
const Checkbox = ReactMock();
const DropDown = ReactMock();
const TextEditorMock = require('core-components/__mocks__/text-editor-mock');

const FormField = requireUnit('core-components/form-field', {
    'core-components/input': Input,
    'core-components/checkbox': Checkbox,
    'core-components/drop-down': DropDown,
    'core-components/text-editor': TextEditorMock
});


describe('FormField component', function () {
    let component, innerField;
    
    function renderFormField(props = { field: 'input'}) {
        let fields = {
            'input': Input,
            'checkbox': Checkbox,
            'select': DropDown,
            'textarea': TextEditorMock
        };
        
        component = reRenderIntoDocument(
            <FormField {...props}/>
        );
        innerField = TestUtils.scryRenderedComponentsWithType(component, fields[props.field])[0];
    }
    
    describe('when calling static getDefaultValue', function () {
        it('should return correct values', function () {
            expect(FormField.getDefaultValue('checkbox')).to.equal(false);
            expect(FormField.getDefaultValue('select')).to.equal(0);
            expect(FormField.getDefaultValue('textarea')).to.equal(TextEditorMock.createEmpty());
        });
    });

    describe('when rendering an input field', function () {

        beforeEach(function () {
            renderFormField({
                field: 'input',
                name: 'MOCK_NAME',
                label: 'MOCK_LABEL',
                error: 'MOCK_ERROR',
                value: 'VALUE_MOCK',
                required: true,
                validation: 'MOCK_VALIDATION',
                fieldProps: {
                    prop1: 'value1',
                    prop2: 'value2',
                    prop3: 'value3'
                },
                onChange: stub(),
                onBlur: stub()
            });
        });

        it('should be wrapped in a label', function () {
            expect(ReactDOM.findDOMNode(component).tagName).to.equal('LABEL');
            expect(ReactDOM.findDOMNode(component).className).to.include('form-field');
            expect(ReactDOM.findDOMNode(component).className).to.include('form-field_errored');
            expect(ReactDOM.findDOMNode(component).className).to.not.include('form-field_select');
            expect(ReactDOM.findDOMNode(component).className).to.not.include('form-field_checkbox');

            renderFormField({
                field: 'input',
                name: 'MOCK_NAME',
                label: 'MOCK_LABEL',
                error: '',
                value: 'VALUE_MOCK',
                required: true,
                validation: 'MOCK_VALIDATION',
                fieldProps: {
                    prop1: 'value1',
                    prop2: 'value2',
                    prop3: 'value3'
                },
                onChange: stub(),
                onBlur: stub()
            });
            expect(ReactDOM.findDOMNode(component).className).to.include('form-field');
            expect(ReactDOM.findDOMNode(component).className).to.not.include('form-field_errored');
            expect(ReactDOM.findDOMNode(component).className).to.not.include('form-field_checkbox');
            expect(ReactDOM.findDOMNode(component).className).to.not.include('form-field_select');
        });

        it('should render error and label in right order and pass correct classes', function () {
            expect(ReactDOM.findDOMNode(component).children[0].tagName).to.equal('SPAN');
            expect(ReactDOM.findDOMNode(component).children[0].className).to.equal('form-field__label');
            expect(ReactDOM.findDOMNode(component).children[0].textContent).to.equal('MOCK_LABEL');

            expect(ReactDOM.findDOMNode(component).children[1]).to.equal(ReactDOM.findDOMNode(innerField));

            expect(ReactDOM.findDOMNode(component).children[2].tagName).to.equal('SPAN');
            expect(ReactDOM.findDOMNode(component).children[2].className).to.equal('form-field__error');
            expect(ReactDOM.findDOMNode(component).children[2].textContent).to.equal('MOCK_ERROR');
        });

        it('should pass props correctly to Input', function () {
            expect(innerField.props).to.include({
                prop1: 'value1',
                prop2: 'value2',
                prop3: 'value3',
                errored: true,
                name: 'MOCK_NAME',
                onBlur: component.props.onBlur,
                required: true,
                value: 'VALUE_MOCK'
            });
        });

        it('should pass disable field when context is loading', function () {
            component.context.loading = true;
            component.forceUpdate();

            expect(innerField.props.disabled).to.equal(true);
            component.context.loading = false;
        });

        it('should pass callbacks correctly', function () {
            component.props.onChange.reset();
            component.props.onBlur.reset();

            innerField.props.onChange({ target: { value: 'SOME_VALUE_2'}});
            innerField.props.onBlur();

            expect(component.props.onBlur).to.have.been.called;
            expect(component.props.onChange).to.have.been.calledWithMatch({target: { value: 'SOME_VALUE_2'}});
        });

        it('should pass focus to the field', function () {
            innerField.focus = stub();
            component.focus();

            expect(innerField.focus).to.have.been.called;
        });
    });

    describe('when rendering a checkbox field', function () {

        beforeEach(function () {
            renderFormField({
                field: 'checkbox',
                name: 'MOCK_NAME',
                label: 'MOCK_LABEL',
                error: 'MOCK_ERROR',
                value: false,
                required: true,
                validation: 'MOCK_VALIDATION',
                fieldProps: {
                    prop1: 'value1',
                    prop2: 'value2',
                    prop3: 'value3'
                },
                onChange: stub(),
                onBlur: stub()
            });
        });

        it('should be wrapped in a label', function () {
            expect(ReactDOM.findDOMNode(component).tagName).to.equal('LABEL');
            expect(ReactDOM.findDOMNode(component).className).to.include('form-field');
            expect(ReactDOM.findDOMNode(component).className).to.include('form-field_checkbox');
            expect(ReactDOM.findDOMNode(component).className).to.include('form-field_errored');

            renderFormField({
                field: 'checkbox',
                name: 'MOCK_NAME',
                label: 'MOCK_LABEL',
                error: '',
                value: false,
                required: true,
                validation: 'MOCK_VALIDATION',
                fieldProps: {
                    prop1: 'value1',
                    prop2: 'value2',
                    prop3: 'value3'
                },
                onChange: stub(),
                onBlur: stub()
            });
            expect(ReactDOM.findDOMNode(component).className).to.include('form-field');
            expect(ReactDOM.findDOMNode(component).className).to.include('form-field_checkbox');
            expect(ReactDOM.findDOMNode(component).className).to.not.include('form-field_errored');
        });

        it('should render error and label in right order and pass correct classes', function () {
            expect(ReactDOM.findDOMNode(component).children[0]).to.equal(ReactDOM.findDOMNode(innerField));

            expect(ReactDOM.findDOMNode(component).children[1].tagName).to.equal('SPAN');
            expect(ReactDOM.findDOMNode(component).children[1].className).to.equal('form-field__label');
            expect(ReactDOM.findDOMNode(component).children[1].textContent).to.equal('MOCK_LABEL');

            expect(ReactDOM.findDOMNode(component).children[2].tagName).to.equal('SPAN');
            expect(ReactDOM.findDOMNode(component).children[2].className).to.equal('form-field__error');
            expect(ReactDOM.findDOMNode(component).children[2].textContent).to.equal('MOCK_ERROR');
        });

        it('should pass props correctly to Checkbox', function () {
            expect(innerField.props).to.include({
                prop1: 'value1',
                prop2: 'value2',
                prop3: 'value3',
                errored: true,
                name: 'MOCK_NAME',
                onBlur: component.props.onBlur,
                required: true,
                value: false
            });
        });

        it('should pass disable field when context is loading', function () {
            component.context.loading = true;
            component.forceUpdate();

            expect(innerField.props.disabled).to.equal(true);
            component.context.loading = false;
        });

        it('should pass callbacks correctly', function () {
            component.props.onChange.reset();
            component.props.onBlur.reset();

            innerField.props.onChange({ target: { checked: true }});
            innerField.props.onBlur();

            expect(component.props.onBlur).to.have.been.called;
            expect(component.props.onChange).to.have.been.calledWithMatch({target: { value: true}});
        });

        it('should pass focus to the field', function () {
            innerField.focus = stub();
            component.focus();

            expect(innerField.focus).to.have.been.called;
        });
    });

    describe('when rendering an select field', function () {

        beforeEach(function () {
            renderFormField({
                field: 'select',
                name: 'MOCK_NAME',
                label: 'MOCK_LABEL',
                error: 'MOCK_ERROR',
                value: 5,
                required: true,
                validation: 'MOCK_VALIDATION',
                fieldProps: {
                    prop1: 'value1',
                    prop2: 'value2',
                    prop3: 'value3',
                    items: []
                },
                onChange: stub(),
                onBlur: stub()
            });
        });

        it('should be wrapped in a label', function () {
            expect(ReactDOM.findDOMNode(component).tagName).to.equal('LABEL');
            expect(ReactDOM.findDOMNode(component).className).to.include('form-field');
            expect(ReactDOM.findDOMNode(component).className).to.include('form-field_errored');
            expect(ReactDOM.findDOMNode(component).className).to.include('form-field_select');
            expect(ReactDOM.findDOMNode(component).className).to.not.include('form-field_checkbox');

            renderFormField({
                field: 'select',
                name: 'MOCK_NAME',
                label: 'MOCK_LABEL',
                error: '',
                value: 5,
                required: true,
                validation: 'MOCK_VALIDATION',
                fieldProps: {
                    prop1: 'value1',
                    prop2: 'value2',
                    prop3: 'value3',
                    items: []
                },
                onChange: stub(),
                onBlur: stub()
            });
            expect(ReactDOM.findDOMNode(component).className).to.include('form-field');
            expect(ReactDOM.findDOMNode(component).className).to.not.include('form-field_errored');
            expect(ReactDOM.findDOMNode(component).className).to.include('form-field_select');
            expect(ReactDOM.findDOMNode(component).className).to.not.include('form-field_checkbox');
        });

        it('should render error and label in right order and pass correct classes', function () {
            expect(ReactDOM.findDOMNode(component).children[0].tagName).to.equal('SPAN');
            expect(ReactDOM.findDOMNode(component).children[0].className).to.equal('form-field__label');
            expect(ReactDOM.findDOMNode(component).children[0].textContent).to.equal('MOCK_LABEL');

            expect(ReactDOM.findDOMNode(component).children[1]).to.equal(ReactDOM.findDOMNode(innerField));

            expect(ReactDOM.findDOMNode(component).children[2].tagName).to.equal('SPAN');
            expect(ReactDOM.findDOMNode(component).children[2].className).to.equal('form-field__error');
            expect(ReactDOM.findDOMNode(component).children[2].textContent).to.equal('MOCK_ERROR');
        });

        it('should pass props correctly to DropDown', function () {
            expect(innerField.props).to.include({
                prop1: 'value1',
                prop2: 'value2',
                prop3: 'value3',
                errored: true,
                name: 'MOCK_NAME',
                onBlur: component.props.onBlur,
                required: true,
                selectedIndex: 5
            });
        });

        it('should pass disable field when context is loading', function () {
            component.context.loading = true;
            component.forceUpdate();

            expect(innerField.props.disabled).to.equal(true);
            component.context.loading = false;
        });

        it('should pass callbacks correctly', function () {
            component.props.onChange.reset();
            component.props.onBlur.reset();

            innerField.props.onChange({index: 2});
            innerField.props.onBlur();

            expect(component.props.onBlur).to.have.been.called;
            expect(component.props.onChange).to.have.been.calledWithMatch({target: {value: 2}});
        });

        it('should pass focus to the field', function () {
            innerField.focus = stub();
            component.focus();

            expect(innerField.focus).to.have.been.called;
        });
    });

    describe('when rendering an textarea field', function () {

        beforeEach(function () {
            renderFormField({
                field: 'textarea',
                name: 'MOCK_NAME',
                label: 'MOCK_LABEL',
                error: 'MOCK_ERROR',
                value: {value: 'VALUE_MOCk'},
                required: true,
                validation: 'MOCK_VALIDATION',
                fieldProps: {
                    prop1: 'value1',
                    prop2: 'value2',
                    prop3: 'value3'
                },
                onChange: stub(),
                onBlur: stub()
            });
        });

        it('should be wrapped in a div', function () {
            expect(ReactDOM.findDOMNode(component).tagName).to.equal('DIV');
            expect(ReactDOM.findDOMNode(component).className).to.include('form-field');
            expect(ReactDOM.findDOMNode(component).className).to.include('form-field_errored');
            expect(ReactDOM.findDOMNode(component).className).to.not.include('form-field_select');
            expect(ReactDOM.findDOMNode(component).className).to.not.include('form-field_checkbox');

            renderFormField({
                field: 'textarea',
                name: 'MOCK_NAME',
                label: 'MOCK_LABEL',
                error: '',
                value: {value: 'VALUE_MOCk'},
                required: true,
                validation: 'MOCK_VALIDATION',
                fieldProps: {
                    prop1: 'value1',
                    prop2: 'value2',
                    prop3: 'value3'
                },
                onChange: stub(),
                onBlur: stub()
            });
            expect(ReactDOM.findDOMNode(component).className).to.include('form-field');
            expect(ReactDOM.findDOMNode(component).className).to.not.include('form-field_errored');
            expect(ReactDOM.findDOMNode(component).className).to.not.include('form-field_checkbox');
            expect(ReactDOM.findDOMNode(component).className).to.not.include('form-field_select');
        });

        it('should render error and label in right order and pass correct classes', function () {
            expect(ReactDOM.findDOMNode(component).children[0].tagName).to.equal('SPAN');
            expect(ReactDOM.findDOMNode(component).children[0].className).to.equal('form-field__label');
            expect(ReactDOM.findDOMNode(component).children[0].textContent).to.equal('MOCK_LABEL');

            expect(ReactDOM.findDOMNode(component).children[1]).to.equal(ReactDOM.findDOMNode(innerField));

            expect(ReactDOM.findDOMNode(component).children[2].tagName).to.equal('SPAN');
            expect(ReactDOM.findDOMNode(component).children[2].className).to.equal('form-field__error');
            expect(ReactDOM.findDOMNode(component).children[2].textContent).to.equal('MOCK_ERROR');
        });

        it('should pass props correctly to TextEditor', function () {
            expect(innerField.props).to.include({
                prop1: 'value1',
                prop2: 'value2',
                prop3: 'value3',
                errored: true,
                name: 'MOCK_NAME',
                onBlur: component.props.onBlur,
                required: true
            });
            expect(innerField.props.value).to.deep.equal({value: 'VALUE_MOCk'});
        });

        it('should pass disable field when context is loading', function () {
            component.context.loading = true;
            component.forceUpdate();

            expect(innerField.props.disabled).to.equal(true);
            component.context.loading = false;
        });

        it('should pass callbacks correctly', function () {
            component.props.onChange.reset();
            component.props.onBlur.reset();

            innerField.props.onChange({ target: { value: 'SOME_VALUE_2'}});
            innerField.props.onBlur();

            expect(component.props.onBlur).to.have.been.called;
            expect(component.props.onChange).to.have.been.calledWithMatch({target: { value: 'SOME_VALUE_2'}});
        });

        it('should pass focus to the field', function () {
            innerField.focus = stub();
            component.focus();

            expect(innerField.focus).to.have.been.called;
        });
    });
});