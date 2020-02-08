let month = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default {
    transformToString(date, expressive = true) {
        date += ''; // Transform to string
        let y = date.substring(0, 4);
        let m = date.substring(4, 6);
        let d = date.substring(6, 8);
        m = (m[0] - '0') * 10 + (m[1] - '0');

        if(!expressive)
            return d + " " + month[m] + " " + y;

        let hr = date.substring(8, 10);
        let min = date.substring(10, 12);

        return d + " " + month[m] + " " + y + " at " + hr + ":" + min;
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
    }
};
