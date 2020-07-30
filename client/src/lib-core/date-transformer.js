import moment from 'moment';

const stringDateFormat = 'YYYYMMDDHHmm';
const localUTCMins = new Date().getTimezoneOffset();
const DEFAULT_UTC_START_DATE = 201701010000;

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
    UTCRangeToLocalRange(range) {
        range = JSON.parse(range);

        const localRange = [
            JSON.parse(this.UTCDateToLocalDate(JSON.stringify(range[0]))),
            JSON.parse(this.UTCDateToLocalDate(JSON.stringify(range[1])))
        ];

        return JSON.stringify(localRange);
    },
    localRangeToUTCRange(range) {
        range = JSON.parse(range);

        const UTCRange = [
            JSON.parse(this.localDateToUTCDate(JSON.stringify(range[0]))),
            JSON.parse(this.localDateToUTCDate(JSON.stringify(range[1])))
        ];

        return JSON.stringify(UTCRange);
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
    getDefaultUTCRange() {
        return JSON.stringify([DEFAULT_UTC_START_DATE, this.getDefaultUTCEndDate()]);
    },
    getDefaultUTCStartDate() {
        return DEFAULT_UTC_START_DATE
    },
    getDefaultUTCEndDate() {
        return (this.getDateToday()*10000)+2359;
    },
    UTCRangeToLocalDateRange(UTCDateRangeFilter) {
        const localDateRange = JSON.parse(this.UTCRangeToLocalRange(UTCDateRangeFilter));

        return {
            valid: true,
            startDate: localDateRange[0],
            endDate: localDateRange[1],
        }
    },
};
