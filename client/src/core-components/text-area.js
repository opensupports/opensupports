import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import TextEditor from 'core-components/text-editor';

class TextArea extends React.Component {

    static contextTypes = {
        loading: React.PropTypes.bool
    };

    static propTypes = {
        value: React.PropTypes.object,
        validation: React.PropTypes.string,
        onChange: React.PropTypes.func,
        required: React.PropTypes.bool,
        error: React.PropTypes.string
    };

    render() {
        return (
            <span className={this.getClass()}>
                <span className="text-area__label">{this.props.label}</span>
                <TextEditor {...this.getEditorProps()}/>
                {this.renderError()}
            </span>
        );
    }

    renderError() {
        let error = null;

        if (this.props.error){
            error = <span className="text-area__error"> {this.props.error} </span>;
        }

        return error;
    }

    getEditorProps() {
        let props = _.clone(this.props);

        props['aria-required'] = this.props.required;
        props.className = 'text-area__input';
        props.ref = 'nativeTextArea';
        props.disabled = this.context.loading;
        props.value = this.props.value;
        props.onChange = this.props.onChange;
        props.errored = !!this.props.error;

        delete props.required;
        delete props.validation;
        delete props.password;

        return props;
    }

    getClass() {
        let classes = {
            'text-area': true,
            'text-area_with-error': (this.props.error),

            [this.props.className]: (this.props.className)
        };

        return classNames(classes);
    }

    focus() {
        if (this.refs.nativeTextArea) {
            this.refs.nativeTextArea.focus();
        }
    }
}

export default TextArea;