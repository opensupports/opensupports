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
    UTCDateToLocalNumericDate(date) {
        return JSON.parse(this.momentToStringDate(this.stringDateToMoment(date).subtract(localUTCMins, 'minutes')));
    },
    localDateToUTCNumericDate(date) {
        return JSON.parse(this.momentToStringDate(this.stringDateToMoment(date).add(localUTCMins, 'minutes')));
    },
    rangeTransformer(range, trasformerFunctionKey) {
        const trasformerDateFunction = {
            UTCToLocal: this.UTCDateToLocalNumericDate.bind(this),
            localToUTC: this.localDateToUTCNumericDate.bind(this)
        }[trasformerFunctionKey];

        return range.map((date) => {return trasformerDateFunction(JSON.stringify(date))});
    },
    transformToString(date, expressive = true) {
        const momentDateLocal = this.stringDateToMoment(JSON.stringify(this.UTCDateToLocalNumericDate(date)));
        if (expressive) momentDateLocal.format('D MMMM YYYY')
        return momentDateLocal.format('D MMMM YYYY, HH:mm');
    },
};
