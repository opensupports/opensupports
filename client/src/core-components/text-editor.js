import React from 'react';
import classNames from 'classnames';
import {Editor} from 'react-draft-wysiwyg';
import {EditorState, ContentState, convertFromHTML} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';

class TextEditor extends React.Component {
    static propTypes = {
        errored: React.PropTypes.bool,
        onChange: React.PropTypes.func,
        value: React.PropTypes.object
    };
    
    static createEmpty() {
        return EditorState.createEmpty()
    }
    
    static getEditorStateFromHTML(htmlString) {
        const blocksFromHTML = convertFromHTML(htmlString);
        const state = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
        );

        return EditorState.createWithContent(state);
    }

    static getHTMLFromEditorState(editorState) {
        return stateToHTML(editorState.getCurrentContent());
    }
    
    static isEditorState(editorState) {
        return editorState && editorState.getCurrentContent;
    }

    state = {
        value: EditorState.createEmpty(),
        focused: false
    };

    render() {
        return (
            <div className={this.getClass()}>
                <Editor {...this.getEditorProps()} />
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
            wrapperClassName: 'text-editor__editor',
            editorState: this.props.value || this.state.value,
            ref: 'editor',
            toolbar: this.getToolbarOptions(),
            onEditorStateChange: this.onEditorChange.bind(this),
            onFocus: this.onEditorFocus.bind(this),
            onBlur: this.onBlur.bind(this)
        };
    }

    getToolbarOptions() {
        return {
            options: ['inline', 'blockType', 'list', 'link', 'image'],
            inline: {
                inDropdown: false,
                options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace']
            },
            blockType: {
                inDropdown: true,
                options: [ 'Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote']
            },
            list: {
                inDropdown: false,
                options: ['unordered', 'ordered']
            },
            image: {
                urlEnabled: true,
                uploadEnabled: false,
                alignmentEnabled: false
            }
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
            this.refs.editor.focusEditor();
        }
    }
}

export default TextEditor;