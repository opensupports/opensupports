import React from 'react';
import classNames from 'classnames';
import {Editor} from 'react-draft-wysiwyg';
import {EditorState, ContentState, convertToRaw} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import {isIE} from 'lib-core/navigator';

class TextEditor extends React.Component {
    static propTypes = {
        errored: React.PropTypes.bool,
        onChange: React.PropTypes.func,
        value: React.PropTypes.oneOfType([
            React.PropTypes.object, React.PropTypes.string
        ])
    };

    static createEmpty() {
        if(isIE()) return '';
        return EditorState.createEmpty();
    }

    static getEditorStateFromHTML(htmlString) {
        if(isIE()) return htmlString;
        const blocksFromHTML = htmlToDraft(htmlString);
        const state = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
        );

        return EditorState.createWithContent(state);
    }

    static getHTMLFromEditorState(editorState) {
        if(isIE()) return editorState;
        return draftToHtml(convertToRaw(editorState.getCurrentContent()));
    }

    static isEditorState(editorState) {
        if(isIE()) return typeof editorState === 'String';
        return editorState && editorState.getCurrentContent;
    }

    state = {
        value: TextEditor.createEmpty(),
        focused: false
    };

    render() {
        return (
            <div className={this.getClass()}>
                {isIE() ? this.renderTextArea() : this.renderDraftJS()}
            </div>
        );
    }

    renderDraftJS() {
        return <Editor {...this.getEditorProps()} />;
    }

    renderTextArea() {
        return (
          <textarea
              className="text-editor__editor"
              onChange={this.onEditorChange.bind(this)}
              onFocus={this.onEditorFocus.bind(this)}
              onBlur={this.onBlur.bind(this)}
              ref="editor"
              value={this.props.value || this.state.value}
          />
        );
    }

    getClass() {
        let classes = {
            'text-editor': true,
            'text-editor_errored': (this.props.errored),
            'text-editor_focused': (this.state.focused),
            'text-editor_textarea': isIE(),

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
            options: ['inline', 'blockType', 'list', 'link', 'image', 'textAlign'],
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
            },
            textAlign: {
                inDropdown: false,
                options: ['left', 'center', 'right', 'justify'],
            },
        };
    }

    onEditorChange(value) {
        if(isIE()) value = value.target.value;
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
            if(isIE()) {
              this.refs.editor.focus();
            } else {
              this.refs.editor.focusEditor();
            }
        }
    }
}

export default TextEditor;
