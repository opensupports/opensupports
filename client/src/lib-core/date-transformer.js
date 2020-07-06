import * as moment from 'moment';

export default {
    transformToString(dateNumber, expressive = true) {
        
        let localDate = new Date();
        let localUTCMins = localDate.getTimezoneOffset();

        dateNumber += '';
        let date = moment(dateNumber, 'YYYYMMDDhhmm').subtract(localUTCMins, 'minutes').format("D MMMM YYYY, HH:mm");
        return date;
    }
};
