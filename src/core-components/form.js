import React              from 'react';
import _                  from 'lodash';

import {reactDFS, renderChildrenWithProps}  from 'lib-core/react-dfs';

import Input              from 'core-components/input';
import Checkbox           from 'core-components/checkbox';

let Form = React.createClass({

    validations: {},

    getInitialState() {
        return {
            form: {}
        }
    },

    componentDidMount() {
        let formState = {};

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
        let props = _.clone(this.props);

        props.onSubmit = this.handleSubmit;

        return props;
    },

    getInputProps({props, type}) {
        let additionalProps = {};

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
        let form = _.clone(this.state.form);

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
