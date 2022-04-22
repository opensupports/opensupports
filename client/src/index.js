import React  from 'react';
import {render} from 'react-dom'
import { Provider } from 'react-redux';

import history from 'lib-app/history';

import SessionActions from 'actions/session-actions';
import ConfigActions from 'actions/config-actions';
import searchFiltersActions from 'actions/search-filters-actions';

import routes from 'app/Routes';
import store from 'app/store';

import { updateSearchTicketsFromURL } from './app/admin/panel/tickets/admin-panel-search-tickets';

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

history.listen(() => {
    store.dispatch(searchFiltersActions.setLoadingInTrue());
    updateSearchTicketsFromURL();
});

store.dispatch(ConfigActions.checkInstallation());
store.dispatch(ConfigActions.init());
store.dispatch(SessionActions.checkSession());
