import React from 'react';
import _ from 'lodash';

import DateSelector from './date-selector';

const ItemsSchema = React.PropTypes.shape({
    startDate: React.PropTypes.number,
    endDate: React.PropTypes.number,
    valid: React.PropTypes.bool,
});

class DateRange extends React.Component {

    static propTypes = {
        defaultValue: ItemsSchema,
        value: ItemsSchema,
        onChange: React.PropTypes.func,
    }

    render() {
        return (
            <div className="date-range">
                <DateSelector
                    className="date-range__date-selector"
                    value={this.props.value.startDate}
                    onChange={this.onChange.bind(this, 'startDate')} />
                <DateSelector
                    className="date-range__date-selector"
                    value={this.props.value.endDate}
                    onChange={this.onChange.bind(this, 'endDate')} />
            </div>
        );
    }

    onChange(date, dateValue) {
        if(dateValue !== "") {
            dateValue = dateValue*10000;
            dateValue = (date === "startDate") ? dateValue : dateValue+2359;    
        } else {
            dateValue = 0;
        }
        const value = _.clone(this.props.value);
        value[date] = dateValue;
        value.valid = this.dateCompare({startDate: value.startDate, endDate: value.endDate});
        this.props.onChange(value);
    }

    dateCompare(dateRange) {
        const { defaultValue } = this.props;
        const startDate = dateRange.startDate ? dateRange.startDate : defaultValue.startDate;
        const endDate = dateRange.endDate ? dateRange.endDate : defaultValue.endDate;
        let isValidRange = startDate <= endDate;
        return isValidRange;
    }
}

export default DateRange;
