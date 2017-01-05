import React from 'react';

import i18n from 'lib-app/i18n';

class ToggleButton extends React.Component {

    
    static propTypes = {
        value: React.PropTypes.bool,
        onChange: React.PropTypes.func
    };

    render() {
        return (
            <div className="toggle-button" onClick={this.onClick.bind(this)}>
                {this.props.value ? i18n('ON') : i18n('OFF')}
            </div>
        );
    }

    onClick() {
        if (this.props.onChange) {
            this.props.onChange({
                target: {
                    value: !this.props.value
                }
            });
        }
    }
}

export default ToggleButton;