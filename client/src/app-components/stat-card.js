import React from 'react';

import Tooltip from 'core-components/tooltip';

class StatCard extends React.Component {

    static propTypes = {
        label: React.PropTypes.string,
        description: React.PropTypes.string,
        value: React.PropTypes.number,
        isPercentage: React.PropTypes.bool
    };

    state = {
        showTooltip: false
    };

    render() {
        const {
            label,
            description,
            value,
            isPercentage
        } = this.props;

        const displayValue = isNaN(value) ? "-" : (isPercentage ? value.toFixed(2) : value);
        return (
            <Tooltip content={description} show={this.state.showTooltip} >
                <div className="admin-panel-stats__card-list__card" onMouseEnter={() => this.setState({showTooltip: true})} onMouseLeave={() => this.setState({showTooltip: false})}>
                    <div className="admin-panel-stats__card-list__card__wrapper">
                            {label}
                        <div className="admin-panel-stats__card-list__container">
                            {displayValue}{isPercentage && !isNaN(value) ? "%" : ""}
                        </div>
                    </div>
                </div>
            </Tooltip>
        );
    }
}

export default StatCard;