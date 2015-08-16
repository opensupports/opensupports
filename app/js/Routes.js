'use strict';

import React                                from 'react/addons';
import {Route, NotFoundRoute, DefaultRoute} from 'react-router';

import App                                  from './App';
import HomePage                             from './pages/HomePage';
import SearchPage                           from './pages/SearchPage';
import NotFoundPage                         from './pages/NotFoundPage';
import DemoPage                             from './pages/component-demo-page';

export default (
  <Route handler={App} path='/'>

    <DefaultRoute handler={HomePage} />

    <Route name='Home' path='/' handler={HomePage} />
    <Route name='Search' path='/search' handler={SearchPage} />
    <Route name='Demo' path='/demo' handler={DemoPage} />

    <NotFoundRoute handler={NotFoundPage} />

  </Route>
);