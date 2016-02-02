import React  from 'react';
import {render} from 'react-dom'
import Router from 'react-router';

import routes from './Routes';

if ( process.env.NODE_ENV !== 'production' ) {
  // Enable React devtools
  window.React = React;
}

render(routes, document.getElementById('app'));
