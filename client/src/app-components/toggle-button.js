import React from 'react';

import classNames from 'classnames';
import i18n from 'lib-app/i18n';

class ToggleButton extends React.Component {
    
    static propTypes = {
        value: React.PropTypes.bool,
        onChange: React.PropTypes.func
    };

    render() {
        return (
            <div className={this.getClass()} onClick={this.onClick.bind(this)}>
                {this.props.value ? i18n('ON') : i18n('OFF')}
            </div>
        );
    }

    getClass() {
        let classes = {
            'toggle-button': true,
            'toggle-button_disabled': (this.props.disabled),
            [this.props.className]: (this.props.className)
        };

        return classNames(classes);
    }


    onClick() {
        if (this.props.onChange && !this.props.disabled) {
            this.props.onChange({
                target: {
                    value: !this.props.value
                }
            });
        }
    }
}

export default ToggleButton;