import React from 'react';


class DateSelector extends React.Component {

    static propTypes = {
        onChange: React.PropTypes.func,
        value: React.PropTypes.number,
    }

    render() {
        return (
            <input
                type="date"
                value={this.parseDate(this.props.value)}
                onChange={event => this.onChangeDate(event.target.value)} />
        );
    }

    onChangeDate(inputDate) {
        const { onChange, } = this.props;
        let date = inputDate;
        if(inputDate !== "") {
            date = JSON.parse(inputDate.replace(/-/g, ""));
        }
        onChange && onChange(date);
    }

    parseDate(date) {
        let newDate = date;

        if(date !== "") {
            newDate = `${date}`;
            newDate = `${newDate.slice(0, 4)}-${newDate.slice(4,6)}-${newDate.slice(6,8)}`;
        }

        return newDate;
    }

}

export default DateSelector;
