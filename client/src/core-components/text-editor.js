import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import _ from 'lodash';
import {Editor, EditorState, RichUtils} from 'draft-js';
import Button from 'core-components/button';

class TextEditor extends React.Component {
    static propTypes = {
        errored: React.PropTypes.bool,
        onChange: React.PropTypes.func,
        value: React.PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty(),
            focused: false
        };
    }

    render() {
        return (
            <div className={this.getClass()}>
                {this.renderEditOptions()}
                <div className="text-editor__editor" onClick={this.focus.bind(this)} onMouseDown={(event) => event.preventDefault()}>
                    <span onMouseDown={(event) => event.stopPropagation()}>
                        <Editor {...this.getEditorProps()} />
                    </span>
                </div>
            </div>
        );
    }

    renderEditOptions() {
        const onBoldClick = (event) => {
            event.preventDefault();
            this.onEditorChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
        };
        const onItalicsClick = (event) => {
            event.preventDefault();
            this.onEditorChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
        };
        const onUnderlineClick = (event) => {
            event.preventDefault();
            this.onEditorChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
        };


        return (
            <div className="text-editor__options">
                <Button type="primary-icon" iconName="bold" onClick={onBoldClick.bind(this)} onMouseDown={(e) => {e.preventDefault()}} />
                <Button type="primary-icon" iconName="italic" onClick={onItalicsClick.bind(this)} onMouseDown={(e) => {e.preventDefault()}} />
                <Button type="primary-icon" iconName="underline" onClick={onUnderlineClick.bind(this)} onMouseDown={(e) => {e.preventDefault()}} />
            </div>
        )
    }

    getClass() {
        let classes = {
            'text-editor': true,
            'text-editor_errored': (this.props.error),
            'text-editor_focused': (this.state.focused),

            [this.props.className]: (this.props.className)
        };

        return classNames(classes);
    }

    getEditorProps() {
        return {
            editorState: this.props.value || this.state.editorState,
            ref: 'editor',
            onChange: this.onEditorChange.bind(this),
            onFocus: this.onEditorFocus.bind(this),
            onBlur: this.onBlur.bind(this)
        };
    }

    onEditorChange(editorState) {
        this.setState({editorState});

        if (this.props.onChange) {
            this.props.onChange({
                target: {
                    value: editorState
                }
            });
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
            this.refs.editor.focus();
        }
    }
}

export default TextEditor;