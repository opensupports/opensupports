import React from 'react';
import classNames from 'classnames';
import RichTextEditor from 'react-rte-browserify';

class TextEditor extends React.Component {
    static propTypes = {
        errored: React.PropTypes.bool,
        onChange: React.PropTypes.func,
        value: React.PropTypes.object
    };

    state = {
        value: RichTextEditor.createEmptyValue(),
        focused: false
    };

    render() {
        return (
            <div className={this.getClass()}>
                <RichTextEditor {...this.getEditorProps()} />
            </div>
        );
    }

    getClass() {
        let classes = {
            'text-editor': true,
            'text-editor_errored': (this.props.errored),
            'text-editor_focused': (this.state.focused),

            [this.props.className]: (this.props.className)
        };

        return classNames(classes);
    }

    getEditorProps() {
        return {
            className: 'text-editor__editor',
            value: this.props.value || this.state.value,
            ref: 'editor',
            onChange: this.onEditorChange.bind(this),
            onFocus: this.onEditorFocus.bind(this),
            onBlur: this.onBlur.bind(this)
        };
    }

    onEditorChange(value) {
        this.setState({value});

        if (this.props.onChange) {
            this.props.onChange({target: {value}});
        }
    }

    onEditorFocus(event) {
        this.setState({focused: true});

        if(this.props.onFocus) {
            this.props.onFocus(event)
        }
    }

    onBlur(event) {
        this.setState({focused: false});

        if(this.props.onBlur) {
            this.props.onBlur(event)
        }
    }

    focus() {
        if (this.refs.editor) {
            this.refs.editor._focus();
        }
    }
}

export default TextEditor;