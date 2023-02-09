import React from 'react';
import classNames from 'classnames';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
import MagicUrl from 'quill-magic-url';
import {isIE} from 'lib-core/navigator';
import Base64ImageParser from 'lib-core/base64-image-parser';

Quill.register('modules/ImageResize', ImageResize);
Quill.register('modules/magicUrl', MagicUrl)

class TextEditor extends React.Component {
    static propTypes = {
        errored: React.PropTypes.bool,
        onChange: React.PropTypes.func,
        value: React.PropTypes.string,
        allowImages: React.PropTypes.bool
    };

    static createEmpty() {
        return '';
    }

    static getEditorStateFromHTML(htmlString) {
        return htmlString;
    }

    static getHTMLFromEditorState(editorState) {
        return editorState;
    }

    static isEditorState(editorState) {
        return typeof editorState === 'String';
    }

    static getContentFormData(content) {
        const images = Base64ImageParser.getImagesSrc(content).map(Base64ImageParser.dataURLtoFile);
        const contentFormData = {
            'content': Base64ImageParser.removeImagesSrc(content),
            'images': images.length,
        };

        images.forEach((image, index) => contentFormData[`image_${index}`] = image);

        return contentFormData;
    }

    state = {
        value: this.props.value,
        focused: false
    };

    render() {
        return (
            <div className={this.getClass()} onPaste={this.onPaste.bind(this)}>
                {isIE() ? this.renderTextArea() : this.renderQuill()}
            </div>
        );
    }

    renderQuill() {
        return <ReactQuill {...this.getEditorProps()} />
    }

    renderTextArea() {
        return (
          <textarea
              className="text-editor__editor"
              onChange={this.onEditorChange.bind(this)}
              onFocus={this.onEditorFocus.bind(this)}
              onBlur={this.onBlur.bind(this)}
              ref="editor"
              value={this.props.value}
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
            className: 'text-editor__editor',
            value: (this.props.value !== undefined) ? this.props.value : this.state.value,
            ref: "editor",
            modules: this.getModulesOptions(),
            onChange: this.onEditorChange.bind(this),
            onFocus: this.onEditorFocus.bind(this),
            onBlur: this.onBlur.bind(this),
            onKeyDown: (e) => { if(e.key == "Tab") { e.preventDefault(); e.stopPropagation(); }}
        };
    }

    getModulesOptions() {
        return {
            toolbar: {
                container: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ align: [] }],
                    ['bold', 'italic', 'underline','strike'],
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    ['blockquote', 'code-block' ],
                    (this.props.allowImages) ? ['link', 'image'] : ['link']
                ],
            },
            ImageResize: {parchment: Quill.import('parchment')},
            magicUrl: true
        };
    }

    onEditorChange(value) {
        if(isIE()) value = value.target.value;
        if(this.props.value === undefined) this.setState({value});

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

    onPaste(event) {
        let items = event.nativeEvent && event.nativeEvent.clipboardData.items;

        for (let index in items) {
            let item = items[index];
            if (item.kind === 'file') {
                event.preventDefault();
                let blob = item.getAsFile();
                let reader = new FileReader();
                reader.onload = (event) => {
                    this.props.onChange({
                        target: {
                            value: (
                                this.props.value
                                + `<img src="${event.target.result}" />`
                            )
                        }
                    });
                };
                reader.readAsDataURL(blob);
            }
        }
    }

    focus() {
        if (this.refs.editor) {
            this.refs.editor.focus();
        }
    }
}

export default TextEditor;
