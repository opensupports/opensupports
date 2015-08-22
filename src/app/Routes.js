import React                                from 'react/addons';
import {Route, NotFoundRoute, DefaultRoute} from 'react-router';

import App                                  from 'app/App';
import DemoPage                             from 'app/demo/components-demo-page';

import MainLayout                           from 'app/main/main-layout';
import MainHomePage                         from 'app/main/main-home-page';


export default (
  <Route handler={App} path='/'>

    <Route name='main' path='/app' handler={MainLayout}>
		<DefaultRoute handler={MainHomePage} />
	</Route>

    <Route name='Demo' path='/demo' handler={DemoPage} />

  </Route>
);