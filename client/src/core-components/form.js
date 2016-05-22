const React = require('react');
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
        }
    },

    componentDidMount() {
        let formState = {};
        let validations = {};

        reactDFS(this.props.children, function (child) {
            if (child.type === Input) {
                formState[child.props.name] = child.props.value || '';
                validations[child.props.name] = ValidationFactory.getValidator(child.props.validation || 'DEFAULT');
            }
            else if (child.type === Checkbox) {
                formState[child.props.name] = child.props.checked || false;
                validations[child.props.name] = ValidationFactory.getValidator(child.props.validation || 'DEFAULT');
            }
        }.bind(this));

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
            this.focusFirstErrorField();
        } else if (this.props.onSubmit) {
            this.props.onSubmit(this.state.form);
        }
    },

    handleInputChange(inputName, type, event) {
        let form = _.clone(this.state.form);
        let errors = _.clone(this.state.errors);
        let inputValue = event.target.value;

        form[inputName] = inputValue;
        errors[inputName] = this.state.validations[inputName].validate(inputValue, form);

        if (type === Checkbox) {
            form[inputName] = event.target.checked || false;
        }

        console.log(errors);

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
            this.refs[firstErrorField].focus();
        }
    },

    getFirstErrorField() {

    },

    validateAllFields: function () {

    }
});

export default Form;
