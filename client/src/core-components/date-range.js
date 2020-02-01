import React from 'react';
import _ from 'lodash';

import DateTransformer from 'lib-core/date-transformer';

import DateSelector from './date-selector';

class DateRange extends React.Component {

    static defaultProps = {
        value: {
            startDate: 20170101,
            endDate: DateTransformer.getDateToday(),
            valid: false,
        },
    }

    render() {
        return (
            <div>
                <DateSelector
                    value={this.props.value.startDate}
                    onChange={this.onChange.bind(this, 'startDate')} />
                <DateSelector
                    value={this.props.value.endDate}
                    onChange={this.onChange.bind(this, 'endDate')} />
            </div>
        );
    }

    onChange(date, dateValue) {
        const value = _.clone(this.props.value);
        value[date] = dateValue;
        value.valid =
            value.startDate !== 0 &&
            value.endDate !== 0 && this.dateCompare({startDate: value.startDate, endDate: value.endDate});
        this.props.onChange(value);
    }

    dateCompare(dateRange) {
        let startDate = dateRange.startDate === "" ? 20170101 : dateRange.startDate;
        let endDate = dateRange.endDate === "" ? DateTransformer.getDateToday() : dateRange.endDate;
        let isValidRange = startDate <= endDate;
        return isValidRange;
    }
}

export default DateRange;
