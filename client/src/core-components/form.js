const React = require('react');
const ReactDOM = require('react-dom');
const _ = require('lodash');

const {reactDFS, renderChildrenWithProps} = require('lib-core/react-dfs');
const ValidationFactory = require('lib-app/validations/validations-factory');

const Input = require('core-components/input');
const Checkbox = require('core-components/checkbox');

const Form = React.createClass({

    getInitialState() {
        return {
            form: {},
            validations: {},
            errors: {}
        };
    },

    componentDidMount() {
        let formState = {};
        let validations = {};

        reactDFS(this.props.children, (child) => {

            if (this.isValidInputType(child)) {
                if (child.type === Input) {
                    formState[child.props.name] = child.props.value || '';
                }
                else if (child.type === Checkbox) {
                    formState[child.props.name] = child.props.checked || false;
                }

                if (child.props.required) {
                    validations[child.props.name] = ValidationFactory.getValidator(child.props.validation || 'DEFAULT');
                }
            }
        });

        this.setState({
            form: formState,
            validations: validations
        });
    },

    render() {
        return (
            <form {...this.getProps()}>
                {renderChildrenWithProps(this.props.children, this.getInputProps)}
            </form>
        );
    },

    getProps() {
        let props = _.clone(this.props);

        props.onSubmit = this.handleSubmit;

        return props;
    },

    getInputProps({props, type}) {
        let additionalProps = {};

        if (type === Input || type === Checkbox) {
            let inputName = props.name;

            additionalProps = {
                ref: inputName,
                value: this.state.form[inputName] || props.value,
                error: this.state.errors[inputName],
                onChange: this.handleInputChange.bind(this, inputName, type)
            }
        }

        return additionalProps;
    },

    handleSubmit(event) {
        event.preventDefault();

        if (this.hasFormErrors()) {
            this.setState({
                errors: this.validateAllFields()
            }, this.focusFirstErrorField);
        } else if (this.props.onSubmit) {
            this.props.onSubmit(this.state.form);
        }
    },

    handleInputChange(inputName, type, event) {
        let form = _.clone(this.state.form);
        let errors;

        form[inputName] = event.target.value;

        if (type === Checkbox) {
            form[inputName] = event.target.checked || false;
        }

        errors = this.validateField(inputName, form);
        this.setState({
            form: form,
            errors: errors
        });
    },

    hasFormErrors() {
        return _.some(this.validateAllFields(), (error) => error);
    },

    focusFirstErrorField() {
        let firstErrorField = this.getFirstErrorField();

        if (firstErrorField) {
            firstErrorField.focus();
        }
    },

    getFirstErrorField() {
        let fieldName = _.findKey(this.state.errors);
        let fieldNode;

        if (fieldName) {
            fieldNode = ReactDOM.findDOMNode(this.refs[fieldName]);
        }

        return fieldNode;
    },

    isValidInputType(child) {
        return child.type === Input || child.type === Checkbox;
    },

    validateAllFields() {
        let form = this.state.form;
        let inputList = Object.keys(this.state.form);
        let errors = {};

        _.each(inputList, (inputName) => {
            errors = this.validateField(inputName, form, errors);
        });

        return errors;
    },

    validateField(inputName, form = this.state.form, errors = this.state.errors) {
        let newErrors = _.clone(errors);

        if (this.state.validations[inputName]) {
            newErrors[inputName] = this.state.validations[inputName].validate(form[inputName], form);
        }

        return newErrors;
    }
});

export default Form;
