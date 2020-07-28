import moment from 'moment';

const stringDateFormat = 'YYYYMMDDHHmm';
const localUTCMins = new Date().getTimezoneOffset();

export default {
    stringDateToMoment(date) {
        return moment(`${date}`, stringDateFormat);
    },
    momentToStringDate(date) {
        return date.format(stringDateFormat);
    },
    UTCDateToLocalDate(date) {
        return this.momentToStringDate(this.stringDateToMoment(date).subtract(localUTCMins, 'minutes'));
    },
    localDateToUTCDate(date) {
        return this.momentToStringDate(this.stringDateToMoment(date).add(localUTCMins, 'minutes'));
    },
    transformToString(date, expressive = true) {
        const momentDateLocal = this.stringDateToMoment(this.UTCDateToLocalDate(date));
        if (expressive) momentDateLocal.format('D MMMM YYYY')
        return momentDateLocal.format('D MMMM YYYY, HH:mm');
    },
    getDate(date) {
        return date < 10 ? `0${date}` : `${date}`;
    },
    getDateToday() {
        let today = new Date();
        let Year = `${today.getFullYear()}`;
        let Month = this.getDate(today.getMonth()+1);
        let Day = this.getDate(today.getDate());
        let newDate = Year.concat(Month.concat(Day));

        return newDate*1;
    },
    getDefaultDateRange(range = undefined) {
        let newDateRange = range;

        if(range) {
            let dateRange = JSON.parse(range);
            let startDate = dateRange[0];
            let endDate = dateRange[1];
            let valid = true;
            newDateRange = {
                startDate: startDate,
                endDate: endDate,
                valid: valid
            }
        }

        return newDateRange;
    },
    formDateRangeToFilters(dateRange) {
        return [dateRange[0]*10000, dateRange[1]*10000+2400];
    },
    dateRangeToFormValue(_dateRange) {
        const dateRange = JSON.parse(_dateRange);

        return {
            valid: true,
            startDate: dateRange[0]/10000,
            endDate: (dateRange[1]-2400)/10000,
        };
    },
};
