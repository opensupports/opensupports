import React from 'react';
import classNames from 'classnames';

import i18n from 'lib-app/i18n';
import Icon from 'core-components/icon';
import Tooltip from 'core-components/tooltip';

class InfoTooltip extends React.Component {
    static propTypes = {
        type: React.PropTypes.oneOf(['default', 'warning']),
        text: React.PropTypes.node.isRequired
    };

    static defaultProps = {
        type: 'default'
    };

    render() {
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
        let message = (this.props.type === 'default') ? i18n('INFO') : i18n('WARNING');

        return (
            <div className="info-tooltip__text">
                <div className="info-tooltip__text-title">
                    {message}
                </div>
                {this.props.text}
            </div>
        );
    }

    getClass() {
        let classes = {
            'info-tooltip': true,
            'info-tooltip_warning': (this.props.type === 'warning')
        };

        classes[this.props.className] = (this.props.className);

        return classNames(classes);
    }
}

export default InfoTooltip;
