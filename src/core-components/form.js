import React              from 'react/addons';
import _                  from 'lodash';

import {reactDFS, renderChildrenWithProps}  from 'lib/react-dfs';

import Input              from 'core-components/input';
import Checkbox           from 'core-components/checkbox';

var Form = React.createClass({

    validations: {},

    getInitialState() {
        return {
            form: {}
        }
    },

    componentDidMount() {
        var formState = {};

        reactDFS(this.props.children, (child) => {
            if (child.type === Input) {
                formState[child.props.name] = child.props.value || '';
            }
            else if (child.type === Checkbox) {
                formState[child.props.name] = child.props.checked || false;
            }
        });

        this.setState({
            form: formState
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
        var props = _.clone(this.props);

        props.onSubmit = this.handleSubmit;

        return props;
    },

    getInputProps({props, type}) {
        var additionalProps = {};

        if (type === Input || type === Checkbox) {
            let inputName = props.name;

            this.validations[inputName] = props.validation;

            additionalProps = {
                onChange: this.handleInputChange.bind(this, inputName, type),
                value: this.state.form[inputName] || props.value
            }
        }

        return additionalProps;
    },

    handleSubmit (event) {
        event.preventDefault();

        if (this.props.onSubmit) {
            this.props.onSubmit(this.state.form);
        }
    },

    handleInputChange(inputName, type, event) {
        var form = _.clone(this.state.form);

        form[inputName] = event.target.value;

        if (type === Checkbox) {
            form[inputName] = event.target.checked || false;
        }

        this.setState({
            form: form
        });
    }
});

export default Form;