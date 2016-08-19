import React from 'react';
import {EditorState} from 'draft-js';
import classNames from 'classnames';
import _ from 'lodash';

import Input from 'core-components/input';
import DropDown from 'core-components/drop-down';
import Checkbox from 'core-components/checkbox';
import TextEditor from 'core-components/text-editor';

class FormField extends React.Component {
    static contextTypes = {
        loading: React.PropTypes.bool
    };

    static propTypes = {
        validation: React.PropTypes.string,
        onChange: React.PropTypes.func,
        onBlur: React.PropTypes.func,
        required: React.PropTypes.bool,
        error: React.PropTypes.string,
        value: React.PropTypes.any,
        field: React.PropTypes.oneOf(['input', 'textarea', 'select', 'checkbox']),
        fieldProps: React.PropTypes.object
    };
    
    static defaultProps = {
        field: 'input'
    };

    static getDefaultValue(field) {
        if (field === 'input') {
            return '';
        }
        else if (field === 'checkbox') {
            return false;
        }
        else if (field === 'textarea') {
             return EditorState.createEmpty();
        }
        else if (field === 'select') {
            return 0;
        }
    }

    render() {
        const Wrapper = (this.props.field === 'textarea') ? 'div' : 'label';
        const fieldContent = [
            <span className="form-field__label" key="label">{this.props.label}</span>,
            this.renderField(),
            this.renderError()
        ];

        if (this.props.field === 'checkbox') {
            fieldContent.swap(0, 1);
        }
        return (
            <Wrapper className={this.getClass()}>
                {fieldContent}
            </Wrapper>
        );
    }

    renderField() {
        const Field = {
            'input': Input,
            'textarea': TextEditor,
            'select': DropDown,
            'checkbox': Checkbox
        }[this.props.field];

        return <Field {...this.getFieldProps()} />;
    }

    renderError() {
        let error = null;

        if (this.props.error) {
            error = <span className="form-field__error" key="error">{this.props.error}</span>;
        }

        return error;
    }

    getClass() {
        let classes = {
            'form-field': true,
            'form-field_errored': (this.props.error),
            'form-field_checkbox': (this.props.field === 'checkbox'),
            'form-field_select': (this.props.field === 'select'),

            [this.props.className]: (this.props.className)
        };

        return classNames(classes);
    }
    
    getFieldProps() {
        let props = _.extend({}, this.props.fieldProps, {
            disabled: this.context.loading,
            errored: !!this.props.error,
            name: this.props.name,
            placeholder: this.props.placeholder,
            key: 'nativeField',
            onChange: this.onChange.bind(this),
            onBlur: this.props.onBlur,
            ref: 'nativeField',
            required: this.props.required
        });

        if (this.props.field === 'select') {
            props.selectedIndex = this.props.value;
        } else {
            props.value = this.props.value;
        }

        return props;
    }

    onChange(nativeEvent) {
        let event = nativeEvent;

        if (this.props.field === 'checkbox') {
            event = {
                target: {
                    value: event.target.checked
                }
            };
        }

        if (this.props.field === 'select') {
            event = {
                target: {
                    value: event.index
                }
            };
        }

        if (this.props.onChange) {
            this.props.onChange(event)
        }
    }

    focus() {
        if (this.refs.nativeField) {
            this.refs.nativeField.focus();
        }
    }
}

export default FormField;