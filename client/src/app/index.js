import React  from 'react';
import {render} from 'react-dom'
import Router from 'react-router';
import UserStore from 'stores/user-store';

import routes from './Routes';

if ( process.env.NODE_ENV !== 'production' ) {
    // Enable React devtools
    window.React = React;
}

if (noFixtures === 'disabled') {
    require('lib-app/fixtures-loader');
}

let onSessionInit = function () {
    render(routes, document.getElementById('app'));
};

UserStore.initSession().then(onSessionInit, onSessionInit);

