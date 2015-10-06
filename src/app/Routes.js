import React                                from 'react/addons';
import {Router, Route, IndexRoute}          from 'react-router';
import CreateBrowserHistory                 from 'react-router/node_modules/history/lib/createBrowserHistory';

import App                                  from 'app/App';
import DemoPage                             from 'app/demo/components-demo-page';

import MainLayout                           from 'app/main/main-layout';
import MainHomePage                         from 'app/main/main-home/main-home-page';
import MainSignUpPage                       from 'app/main/main-signup/main-signup-page';


export default (
    <Router history={CreateBrowserHistory()}>
      <Route component={App} path='/'>

        <Route path='/app' component={MainLayout}>
            <IndexRoute component={MainHomePage} />
            <Route path='signup' component={MainSignUpPage}/>
        </Route>

        <Route name='Demo' path='demo' component={DemoPage} />

      </Route>
    </Router>
);