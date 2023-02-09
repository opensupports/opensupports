export default {
    getDate(date) {
        let yyyy = date.getFullYear().toString();
        let mm = (date.getMonth()+1).toString(); // getMonth() is zero-based         
        let dd  = date.getDate().toString();

        return (yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0])) * 1;
    },

    getCurrentDate() {
        return this.getDate(new Date());
    },

    getFullDate(date) {
        let hh = date.getHours();
        let mm = date.getMinutes();
        return this.getDate(date) * 10000 + hh*100 + mm;
    },

    getCurrentFullDate() {
        return this.getFullDate(new Date())
    }
}