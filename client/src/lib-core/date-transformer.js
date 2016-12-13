let month = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default {
    transformToString(date, expressive) {
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
    }
};
