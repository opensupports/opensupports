import React              from 'react/addons';
import _                  from 'lodash';

import Input              from 'core-components/input';

var Form = React.createClass({

    validations: {},

    getInitialState() {
        return {
            form: {}
        }
    },

    render() {
        return (
            <form>
                {this.renderTraversedChildren(this.props.children)}
            </form>
        );
    },

    renderTraversedChildren(children) {
        if (typeof children !== 'object' || children === null) {
            return children;
        }

        return React.Children.map(children, function (child) {
            if (typeof child !== 'object' || child === null) {
                return child;
            }

            if (child.props && child.type === Input) {
                return React.cloneElement(child, this.getInputProps(child.props), child.props && child.props.children);
            } else {
                return React.cloneElement(child, {}, this.renderTraversedChildren(child.props && child.props.children));
            }
        }.bind(this));
    },

    getInputProps(props) {
        var inputName = props.name;

        this.validations[inputName] = props.validation;

        return {
            onChange: this.handleInputChange.bind(this, inputName),
            value: this.state.form[inputName] || props.value
        };
    },

    handleInputChange(inputName, event) {
        var form = _.clone(this.state.form);

        form[inputName] = event.target.value;

        this.setState({
            form: form
        });
    }
});

export default Form;