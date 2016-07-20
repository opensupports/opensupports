export default {
    getCurrentDate() {
        let date = new Date();
        let yyyy = date.getFullYear().toString();
        let mm = (date.getMonth()+1).toString(); // getMonth() is zero-based         
        let dd  = date.getDate().toString();

        return (yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0])) * 1;
    }
}