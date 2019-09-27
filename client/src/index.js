import React  from 'react';
import {render} from 'react-dom'
import { Provider } from 'react-redux';

import SessionActions from 'actions/session-actions';
import ConfigActions from 'actions/config-actions';
import routes from 'app/Routes';
import store from 'app/store';

import './main.scss';

Array.prototype.swap = function (x,y) {
    var b = this[x];
    this[x] = this[y];
    this[y] = b;
    return this;
};

if (process.env.NODE_ENV !== 'production') {
    // Enable React devtools
    window.React = React;
}

if (process.env.FIXTURES) {
    require('lib-app/fixtures-loader');
}

let renderApplication = function () {
    render(<Provider store={store}>{routes}</Provider>, document.getElementById('app'));
};
window.store = store;

let unsubscribe = store.subscribe(() => {
    if(showLogs) console.log(store.getState());

    if (store.getState().session.initDone && store.getState().config.initDone) {
        unsubscribe();
        renderApplication();
    }
});

store.dispatch(ConfigActions.checkInstallation());
store.dispatch(ConfigActions.init());
store.dispatch(SessionActions.initSession());
