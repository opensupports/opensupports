import {browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import {useBasename} from 'history';
import store from 'app/store';

const history = syncHistoryWithStore(browserHistory, store);

let prevUrl = [];

const _push = window.history.pushState;
const _pushState = window.history.pushState;

window.history.pushState = (...args) => {
    console.log('historypushState', window.location.href);
    prevUrl = window.location.href;
    return _pushState.call(window.history, ...args);
};
window.history.push = (...args) => {
    console.log('historypush');
    prevUrl = window.location.href;
    return _push.call(window.history, ...args);
};

export default useBasename(() => history)({basename: globalIndexPath});

export const getPrevUrl = () => prevUrl;
export const setPrevUrl = (_prevUrl) => prevUrl = _prevUrl;