import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import TextEditor from 'core-components/text-editor';

class TextArea extends React.Component {

    static contextTypes = {
        loading: React.PropTypes.bool
    };

    static propTypes = {
        value: React.PropTypes.string,
        validation: React.PropTypes.string,
        onChange: React.PropTypes.func,
        required: React.PropTypes.bool,
        error: React.PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty()
        };
        this.onChange = (editorState) => this.setState({editorState});
    }

    render() {
        return (
            <label className={this.getClass()}>
                <span className="text-area__label">{this.props.label}</span>
                    <TextEditor />
                {this.renderError()}
            </label>
        );
    }

    renderError() {
        let error = null;

        if (this.props.error){
            error = <span className="text-area__error"> {this.props.error} </span>;
        }

        return error;
    }

    /*getEditorProps() {
        let props = _.clone(this.props);

        props['aria-required'] = this.props.required;
        props.className = 'text-area__input';
        props.ref = 'nativeTextArea';
        props.disabled = this.context.loading;

        delete props.required;
        delete props.validation;
        delete props.error;
        delete props.password;

        return props;
    }*/

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