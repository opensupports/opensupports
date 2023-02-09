export function getInternetExplorerVersion() {
    let rv = -1

    if(navigator.appName == 'Microsoft Internet Explorer') {
        let ua = navigator.userAgent;
        let re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null) rv = parseFloat(RegExp.$1);
    }

    return rv;
}

export function isIE() {
    return !!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g);
}
