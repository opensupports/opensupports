import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import _ from 'lodash';
import {Editor, EditorState, RichUtils} from 'draft-js';
import Button from 'core-components/button';

class TextEditor extends React.Component {
    static propTypes = {
        error: React.PropTypes.bool
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
                <div className="text-editor__editor" onClick={this.focus.bind(this)}>
                    <Editor {...this.getEditorProps()} />
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
            this.onEditorChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALICS'));
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
            editorState: this.state.editorState,
            ref: 'editor',
            onChange: this.onEditorChange.bind(this),
            onFocus: this.onEditorFocus.bind(this),
            onBlur: this.onBlur.bind(this)
        };
    }

    onEditorChange(editorState) {
        this.setState({editorState});
    }

    onEditorFocus() {
        this.setState({focused: true});
    }

    onBlur() {
        this.setState({focused: false});
    }

    focus() {
        if (this.refs.editor) {
            this.refs.editor.focus();
        }
    }
}

export default TextEditor;