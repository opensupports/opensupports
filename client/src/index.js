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
    
    // Suppress React deprecation warnings for legacy code
    const originalConsoleWarn = console.warn;
    console.warn = function(...args) {
        const message = args[0];
        if (typeof message === 'string' && (
            message.includes('Accessing PropTypes via the main React package is deprecated') ||
            message.includes('Accessing createClass via the main React package is deprecated') ||
            message.includes('React.createElement: type is invalid')
        )) {
            return; // Suppress these specific warnings
        }
        originalConsoleWarn.apply(console, args);
    };
}

if (process.env.FIXTURES) {
    require('lib-app/fixtures-loader');
}

let renderApplication = function () {
    render(<Provider store={store}>{routes}</Provider>, document.getElementById('app'));
};
window.store = store;

let unsubscribe = store.subscribe(() => {
    // showLogs 변수 체크 제거하고 개발 모드에서만 로그 출력
    if (process.env.NODE_ENV !== 'production') {
        console.log(store.getState());
    }

    // config가 초기화되면 앱 렌더링
    if (store.getState().config.initDone) {
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
