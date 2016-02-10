import React  from 'react';
import {render} from 'react-dom'
import Router from 'react-router';

import routes from './Routes';

if ( process.env.NODE_ENV !== 'production' ) {
  // Enable React devtools
  window.React = React;
}

//TODO: Add env variable to determinate if it should use fixtures
/*
if ( process.env.API !== 'production' ) {
  // Mock API calls
  require('lib/fixtures/fixtures-loader');
}
*/

render(routes, document.getElementById('app'));
