import React                                from 'react/addons';
import {Route, NotFoundRoute, DefaultRoute} from 'react-router';

import App                                  from 'app/App';
import DemoPage                             from 'app/demo/components-demo-page';

import MainLayout                           from 'app/main/main-layout';
import MainHomePage                         from 'app/main/main-home/main-home-page';
import MainSignUpPage                       from 'app/main/main-signup/main-signup-page';


export default (
  <Route handler={App} path='/'>

    <Route name='main' path='/app' handler={MainLayout}>
		<DefaultRoute name='home' handler={MainHomePage} />
        <Route name='signup' path='/app/signup' handler={MainSignUpPage}/>
	</Route>

    <Route name='Demo' path='/demo' handler={DemoPage} />

  </Route>
);