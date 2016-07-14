const React = require('react');
const _ = require('lodash');

const {reactDFS, renderChildrenWithProps} = require('lib-core/react-dfs');
const ValidationFactory = require('lib-app/validations/validations-factory');

const Input = require('core-components/input');
const Checkbox = require('core-components/checkbox');

const Form = React.createClass({

    propTypes: {
        errors: React.PropTypes.object,
        onValidateErrors: React.PropTypes.func,
        onSubmit: React.PropTypes.func
    },

    getInitialState() {
        return {
            form: {},
            validations: {},
            errors: {}
        };
    },

    componentDidMount() {
        this.setState(this.getInitialFormAndValidations());
    },

    render() {
        return (
            <form {...this.getProps()}>
                {renderChildrenWithProps(this.props.children, this.getFieldProps)}
            </form>
        );
    },

    getProps() {
        let props = _.clone(this.props);

        props.onSubmit = this.handleSubmit;
        
        delete props.errors;
        delete props.onValidateErrors;

        return props;
    },

    getFieldProps({props, type}) {
        let additionalProps = {};

        if (type === Input || type === Checkbox) {
            let fieldName = props.name;

            additionalProps = {
                ref: fieldName,
                value: this.state.form[fieldName] || props.value,
                error: this.getFieldError(fieldName),
                onChange: this.handleFieldChange.bind(this, fieldName, type),
                onBlur: this.validateField.bind(this, fieldName)
            }
        }

        return additionalProps;
    },

    getFieldError(fieldName) {
        let error = this.state.errors[fieldName];

        if (this.props.errors) {
            error = this.props.errors[fieldName]
        }
        return error;
    },

    getFirstErrorField() {
        let fieldName = _.findKey(this.state.errors);
        let fieldNode;

        if (fieldName) {
            fieldNode = this.refs[fieldName];
        }

        return fieldNode;
    },

    getAllFieldErrors() {
        let form = this.state.form;
        let fields = Object.keys(this.state.form);
        let errors = {};

        _.each(fields, (fieldName) => {
            errors = this.getErrorsWithValidatedField(fieldName, form, errors);
        });

        return errors;
    },

    getErrorsWithValidatedField(fieldName, form = this.state.form, errors = this.state.errors) {
        let newErrors = _.clone(errors);

        if (this.state.validations[fieldName]) {
            newErrors[fieldName] = this.state.validations[fieldName].validate(form[fieldName], form);
        }

        return newErrors;
    },

    getInitialFormAndValidations() {
        let form = {};
        let validations = {};

        reactDFS(this.props.children, (child) => {

            if (this.isValidFieldType(child)) {
                if (child.type === Input) {
                    form[child.props.name] = child.props.value || '';
                }
                else if (child.type === Checkbox) {
                    form[child.props.name] = child.props.checked || false;
                }

                if (child.props.required) {
                    validations[child.props.name] = ValidationFactory.getValidator(child.props.validation || 'DEFAULT');
                }
            }
        });

        return {
            form: form,
            validations: validations
        }
    },

    handleSubmit(event) {
        event.preventDefault();

        if (this.hasFormErrors()) {
            this.updateErrors(this.getAllFieldErrors(), this.focusFirstErrorField);
        } else if (this.props.onSubmit) {
            this.props.onSubmit(this.state.form);
        }
    },

    handleFieldChange(fieldName, type, event) {
        let form = _.clone(this.state.form);

        form[fieldName] = event.target.value;

        if (type === Checkbox) {
            form[fieldName] = event.target.checked || false;
        }

        this.setState({
            form: form
        });
    },

    isValidFieldType(child) {
        return child.type === Input || child.type === Checkbox;
    },

    hasFormErrors() {
        return _.some(this.getAllFieldErrors());
    },

    validateField(fieldName) {
        this.updateErrors(this.getErrorsWithValidatedField(fieldName));
    },

    updateErrors(errors, callback) {
        this.setState({
            errors
        }, callback);

        if (this.props.onValidateErrors) {
            this.props.onValidateErrors(errors);
        }
    },

    focusFirstErrorField() {
        let firstErrorField = this.getFirstErrorField();

        if (firstErrorField) {
            firstErrorField.focus();
        }
    }
});

export default Form;
