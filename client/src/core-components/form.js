import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import {reactDFS, renderChildrenWithProps} from 'lib-core/react-dfs';
import ValidationFactory from 'lib-app/validations/validator-factory';

import FormField from 'core-components/form-field';

class Form extends React.Component {

    static propTypes = {
        loading: React.PropTypes.bool,
        errors: React.PropTypes.object,
        onValidateErrors: React.PropTypes.func,
        onChange: React.PropTypes.func,
        values: React.PropTypes.object,
        onSubmit: React.PropTypes.func,
        defaultValues: React.PropTypes.object
    };

    static childContextTypes = {
        loading: React.PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.state = {
            form: props.defaultValues || {},
            validations: {},
            errors: {}
        };
    }

    getChildContext() {
        return {
            loading: this.props.loading
        };
    }

    componentDidMount() {
        this.setState(this.getInitialFormAndValidations(this.props.children));
    }

    componentDidUpdate(nextProps) {
        if(nextProps.values != this.props.values) {
            this.setState(this.getInitialFormAndValidations(nextProps.children));
        }
    }

    render() {
        return (
            <form {...this.getProps()}>
                {renderChildrenWithProps(this.props.children, this.getFieldProps.bind(this))}
            </form>
        );
    }

    getProps() {
        let props = _.clone(this.props);

        props.className = this.getClass();
        props.onSubmit = this.handleSubmit.bind(this);

        delete props.errors;
        delete props.loading;
        delete props.onValidateErrors;
        delete props.values;
        delete props.onChange;

        return props;
    }

    getClass() {
        let classes = {
            'form': true
        };

        classes[this.props.className] = (this.props.className);

        return classNames(classes);
    }

    getFieldProps({props, type}) {
        let additionalProps = {};

        if (this.isValidField({type})) {
            let fieldName = props.name;

            additionalProps = {
                ref: fieldName,
                value: this.getFormValue()[fieldName],
                error: this.getFieldError(fieldName),
                onChange: this.handleFieldChange.bind(this, fieldName),
                onBlur: this.validateField.bind(this, fieldName)
            }
        }

        return additionalProps;
    }

    getFieldError(fieldName) {
        let error = this.state.errors[fieldName];

        if (this.props.errors) {
            error = this.props.errors[fieldName]
        }
        return error;
    }

    getFirstErrorField() {
        let fieldName = _.findKey(this.state.errors);
        let fieldNode;

        if (fieldName) {
            fieldNode = this.refs[fieldName];
        }

        return fieldNode;
    }

    getAllFieldErrors() {
        let form = this.getFormValue();
        let fields = Object.keys(form);
        let errors = {};

        _.each(fields, (fieldName) => {
            errors = this.getErrorsWithValidatedField(fieldName, form, errors);
        });

        return errors;
    }

    getErrorsWithValidatedField(fieldName, form = this.getFormValue(), errors = this.state.errors) {
        let newErrors = _.clone(errors);

        if (this.state.validations[fieldName]) {
            newErrors[fieldName] = this.state.validations[fieldName].performValidation(form[fieldName], form);
        }

        return newErrors;
    }

    getInitialFormAndValidations(children) {
        let form = {};
        let validations = {};

        reactDFS(children, (child) => {
            if (this.isValidField(child)) {
                form[child.props.name] = child.props.value || FormField.getDefaultValue(child.props.field);

                if (child.props.required) {
                    validations[child.props.name] = ValidationFactory.getValidator(child.props.validation || 'DEFAULT');
                }
            }
        });

        return {
            form: form,
            validations: validations
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        const form = this.getFormValue();

        if (this.hasFormErrors()) {
            this.updateErrors(this.getAllFieldErrors(), this.focusFirstErrorField.bind(this));
        } else if (this.props.onSubmit) {
            this.props.onSubmit(form);
        }
    }

    handleFieldChange(fieldName, event) {
        let form = _.clone(this.getFormValue());

        form[fieldName] = event.target.value;

        if(this.props.values === undefined) this.setState({form});

        if (this.props.onChange) {
            this.props.onChange(form);
        }
    }

    isValidField(node) {
        return node.type === FormField;
    }

    hasFormErrors() {
        return _.some(this.getAllFieldErrors());
    }

    validateField(fieldName) {
        this.updateErrors(this.getErrorsWithValidatedField(fieldName));
    }

    updateErrors(errors, callback) {
        this.setState({
            errors
        }, callback);

        if (this.props.onValidateErrors) {
            this.props.onValidateErrors(errors);
        }
    }

    getFormValue() {
        return (this.props.values !== undefined) ? this.props.values : this.state.form;
    }

    focusFirstErrorField() {
        let firstErrorField = this.getFirstErrorField();

        if (firstErrorField) {
            firstErrorField.focus();
        }
    }
}

export default Form;
