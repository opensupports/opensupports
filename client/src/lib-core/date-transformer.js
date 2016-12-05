let month = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default {
    transformToString (date) {
        date += ''; //Transform to string
        let y = date.substring(0, 4);
        let m = date.substring(4, 6);
        let d = date.substring(6, 8);
        m = (m[0] - '0') * 10 + (m[1] - '0');

        return d + " " + month[m] + " " + y;
    }
};