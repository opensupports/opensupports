import React from 'react';

import Button from 'core-components/button';
import Icon from 'core-components/icon';

class FileUploader extends React.Component {
    static propTypes = {
        text: React.PropTypes.string,
        value: React.PropTypes.object,
        onChange: React.PropTypes.func
    };

    static defaultProps = {
        text: 'Upload file'
    };

    render() {
        return (
            <label className="file-uploader">
                <input className="file-uploader__input" type="file" multiple={false} onChange={this.onChange.bind(this)}/>
                <span className="file-uploader__custom" tabIndex="0">
                    <Icon className="file-uploader__icon" name="upload" /> {this.props.text}
                </span>
                <span className="file-uploader__value">{this.props.value && this.props.value.name}</span>
            </label>
        );
    }

    onChange(event) {
        if(this.props.onChange) {
            this.props.onChange({
                target: {
                    value: event.target.files[0]
                }
            });
        }
    }
}

export default FileUploader;