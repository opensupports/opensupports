import randomString       from 'random-string';

export default {
    removeImagesSrc(str) {
        let index=-1;
        str = str.replace(/src="(data:image\/[^;]+;base64[^"]+)"/g, () => {
            index++;
            return `src="IMAGE_PATH_${index}"`;
        });

        return str;
    },

    getImagesSrc(str) {
        let m,
        urls = [],
        rex = /src="(data:image\/[^;]+;base64[^"]+)"/g;

        while ( m = rex.exec( str ) ) {
            urls.push( m[1] );
        }

        return urls;
    },

    dataURLtoFile(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);

        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }

        let extension=".jpg";
        if(dataurl.indexOf("image/png") !== -1) extension=".png";
        else if(dataurl.indexOf("image/tiff") !== -1) extension=".tiff";
        else if(dataurl.indexOf("image/bmp") !== -1) extension=".bmp";
        else if(dataurl.indexOf("image/gif") !== -1) extension=".gif";

        return new File([u8arr], randomString() + extension, {type:mime});
    },
};
