import React from 'react';
import classNames from 'classnames';

import Icon from 'core-components/icon';
import Tooltip from 'core-components/tooltip';

class InfoTooltip extends React.Component {
    static propTypes = {
        type: React.PropTypes.oneOf(['default', 'warning']),
        text: React.PropTypes.string.isRequired
    };

    static defaultProps = {
        type: 'default'
    };

    render() {
        // exclamation-triangle
        // question-circle
        let name = (this.props.type === 'default') ? 'question-circle' : 'exclamation-triangle';

        return (
            <div className={this.getClass()}>
                <Tooltip content={this.renderText()} openOnHover>
                    <span className="info-tooltip__icon">
                        <Icon name={name}/>
                    </span>
                </Tooltip>
            </div>
        );
    }

    renderText() {
        return (
            <div className="info-tooltip__text">
                {this.props.text}
            </div>
        );
    }

    getClass() {
        let classes = {
            'info-tooltip': true,
            'info-tooltip_warning': (this.props.type === 'warning')
        };

        return classNames(classes);
    }
}

export default InfoTooltip;
