import React  from 'react';
import {render} from 'react-dom'
import { Provider } from 'react-redux';

import SessionActions from 'actions/session-actions';
import routes from './Routes';
import store from './store';

if ( process.env.NODE_ENV !== 'production' ) {
    // Enable React devtools
    window.React = React;
}

if (noFixtures === 'disabled') {
    require('lib-app/fixtures-loader');
}

let renderApplication = function () {
    render(<Provider store={store}>{routes}</Provider>, document.getElementById('app'));
};

store.dispatch(SessionActions.initSession());

let unsubscribe = store.subscribe(() => {
    console.log(store.getState());

    if (store.getState().session.initDone) {
        unsubscribe();
        renderApplication();
    }
});
