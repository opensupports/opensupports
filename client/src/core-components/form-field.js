import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import Input from 'core-components/input';
import DropDown from 'core-components/drop-down';
import Checkbox from 'core-components/checkbox';
import CheckboxGroup from 'core-components/checkbox-group';
import TextEditor from 'core-components/text-editor';
import InfoTooltip from 'core-components/info-tooltip';
import FileUploader from 'core-components/file-uploader';

class FormField extends React.Component {
    static contextTypes = {
        loading: React.PropTypes.bool
    };

    static propTypes = {
        decorator: React.PropTypes.func,
        validation: React.PropTypes.string,
        onChange: React.PropTypes.func,
        onBlur: React.PropTypes.func,
        required: React.PropTypes.bool,
        error: React.PropTypes.string,
        infoMessage: React.PropTypes.node,
        value: React.PropTypes.any,
        field: React.PropTypes.oneOf(['input', 'textarea', 'select', 'checkbox', 'checkbox-group', 'file']),
        fieldProps: React.PropTypes.object
    };
    
    static defaultProps = {
        field: 'input',
        fieldProps: {}
    };

    static getDefaultValue(field) {
        if (field === 'input') {
            return '';
        }
        else if (field === 'checkbox') {
            return false;
        }
        else if (field === 'checkbox-group') {
            return [];
        }
        else if (field === 'textarea') {
             return TextEditor.createEmpty();
        }
        else if (field === 'select') {
            return 0;
        }
    }

    render() {
        const Wrapper = (_.includes(this.getDivTypes(), this.props.field)) ? 'div' : 'label';
        const fieldContent = [
            this.renderLabel(),
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

    renderLabel() {
        return (
            <span className="form-field__label" key="label">
                {this.props.label}
                {(this.props.infoMessage) ? <InfoTooltip text={this.props.infoMessage} className="form-field__info" /> : null}
            </span>
        )
    }

    renderField() {
        let Field = {
            'input': Input,
            'textarea': TextEditor,
            'select': DropDown,
            'checkbox': Checkbox,
            'checkbox-group': CheckboxGroup,
            'file': FileUploader
        }[this.props.field];

        if(this.props.decorator) {
            Field = this.props.decorator;
        }

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
            disabled: this.isDisabled(),
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

    getDivTypes() {
        return [
            'textarea',
            'checkbox-group',
            'file'
        ];
    }

    onChange(nativeEvent) {
        let event = nativeEvent;

        if (this.props.field === 'checkbox' && !this.props.decorator) {
            event = {
                target: {
                    value: event.target.checked
                }
            };
        }

        if (this.props.field === 'select' && !this.props.decorator) {
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
    
    isDisabled() {
        const fieldProps = this.props.fieldProps;

        return (fieldProps.disabled === undefined) ? this.context.loading : fieldProps.disabled;
    }

    focus() {
        if (this.refs.nativeField) {
            this.refs.nativeField.focus();
        }
    }
}

export default FormField;