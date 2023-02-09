import React from 'react';

import Button from 'core-components/button';
import Icon from 'core-components/icon';

import i18n from 'lib-app/i18n';

class FileUploader extends React.Component {
    static propTypes = {
        text: React.PropTypes.string,
        value: React.PropTypes.object,
        onChange: React.PropTypes.func
    };

    static defaultProps = {
        text: i18n('UPLOAD_FILE')
    };

    render() {
        return (
            <label className="file-uploader">
                <input className="file-uploader__input" type="file" multiple={false} accept={this.getMimeTypes()} onChange={this.onChange.bind(this)}/>
                <span className="file-uploader__custom" tabIndex="0">
                    <Icon className="file-uploader__icon" name="upload" /> {this.props.text}
                </span>
                <span className="file-uploader__value">{this.props.value && this.props.value.name}</span>
            </label>
        );
    }

    getMimeTypes() {
        return `
            image/png,
            image/gif,
            image/jpeg,
            image/bmp,
            image/tiff,
            application/gzip,
            application/x-gzip,
            application/zip,
            application/x-rar-compressed,
            application/x-7z-compressed,
            application/x-tar,
            application/x-bzip,
            application/x-bzip2,
            text/csv,
            text/rtf,
            application/msword,
            application/vnd.ms-excel,
            text/plain,
            application/pdf
        `;
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
