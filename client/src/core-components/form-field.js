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
import Autocomplete from './autocomplete';
import DateRange from './date-range';
import SearchBox from './search-box';
import TagSelector from './tag-selector';

class FormField extends React.Component {
    static contextTypes = {
        loading: React.PropTypes.bool
    };

    static propTypes = {
        decorator: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.string]),
        validation: React.PropTypes.string,
        onChange: React.PropTypes.func,
        onBlur: React.PropTypes.func,
        required: React.PropTypes.bool,
        error: React.PropTypes.string,
        infoMessage: React.PropTypes.node,
        value: React.PropTypes.any,
        field: React.PropTypes.oneOf([
            'input',
            'textarea',
            'select',
            'checkbox',
            'checkbox-group',
            'file',
            'autocomplete',
            'tag-selector',
            'date-range',
            'search-box'
        ]),
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
                {(this.props.infoMessage) ?
                <InfoTooltip
                    text={this.props.infoMessage}
                    className="form-field__info" /> :
                null}
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
            'file': FileUploader,
            'autocomplete': Autocomplete,
            'tag-selector': TagSelector,
            'date-range': DateRange,
            'search-box': SearchBox,
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
            'form-field_autocomplete': (this.props.field === 'autocomplete'),
            'form-field_tag-selector': (this.props.field === 'tag-selector'),
            'form-field_date-range': (this.props.field === 'date-range'),
            'form-field_search-box': (this.props.field === 'search-box'),

            [this.props.className]: (this.props.className)
        };

        return classNames(classes);
    }

    getFieldProps() {
        const {
            fieldProps,
            error,
            name,
            placeholder,
            onBlur,
            required,
            field,
            value,
            decorator
        } = this.props;

        let props = _.extend({}, fieldProps, {
            disabled: this.isDisabled(),
            errored: !!error,
            name,
            placeholder,
            key: 'nativeField',
            onChange: this.onChange.bind(this),
            onBlur,
            ref: 'nativeField',
            required
        });

        if(field === 'select') {
            props.selectedIndex = value;
        }

        if(decorator === 'textarea') {
            delete props.errored;
        }

        if(field === 'date-range') {
            props.value = {
                startDate: value[0],
                endDate: value[1],
                valid: false,
            };
        }
        
        if(field === 'tag-selector') {
            props.values = value;
        }
        
        if(field === 'autocomplete') {
            props.values = value;
        }

        if(field === 'checkbox') {
            props.value = !!value;
        } else {
            props.value = value;
        }

        return props;
    }

    getDivTypes() {
        return [
            'textarea',
            'checkbox-group',
            'file',
            'date-range'
        ];
    }

    onChange(nativeEvent) {
        const {
            field,
            decorator,
            onChange
        } = this.props;
        let event = nativeEvent;
        if(field === 'checkbox' && !decorator) {
            event = {
                target: {
                    value: event.target.checked
                }
            };
        }

        if(field === 'select' && !decorator) {
            event = {
                target: {
                    value: event.index
                }
            };
        }

        if(field === 'autocomplete' && !decorator) {
            event = {
                target: {
                    value: nativeEvent
                }
            };
        }

        if(field === 'tag-selector' && !decorator) {
            event = {
                target: {
                    value: nativeEvent
                }
            };
        }

        if(field === 'search-box' && !decorator) {
            event = {
                target: {
                    value: nativeEvent
                }
            };
        }

        if(field === 'date-range' && !decorator) {
            event = {
                target: {
                    value: nativeEvent
                }
            };
        }

        onChange && onChange(event);
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
