import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import store from 'app/store';

import App from 'app/App';
import DemoPage from 'app/demo/components-demo-page';

import MainLayout from 'app/main/main-layout';
import MainHomePage from 'app/main/main-home/main-home-page';
import MainSignUpPage from 'app/main/main-signup/main-signup-page';
import MainRecoverPasswordPage from 'app/main/main-recover-password/main-recover-password-page';

import DashboardLayout from 'app/main/dashboard/dashboard-layout';

import DashboardListTicketsPage from 'app/main/dashboard/dashboard-list-tickets/dashboard-list-tickets-page';
import DashboardListArticlesPage from 'app/main/dashboard/dashboard-list-articles/dashboard-list-articles-page';

import DashboardCreateTicketPage from 'app/main/dashboard/dashboard-create-ticket/dashboard-create-ticket-page';
import DashboardEditProfilePage from 'app/main/dashboard/dashboard-edit-profile/dashboard-edit-profile-page';

import DashboardArticlePage from 'app/main/dashboard/dashboard-article/dashboard-article-page';
import DashboardTicketPage from 'app/main/dashboard/dashboard-ticket/dashboard-ticket-page';

const history = syncHistoryWithStore(browserHistory, store);

export default (
    <Router history={history}>
        <Route component={App} path='/'>
            <Route path='/app' component={MainLayout}>
                <IndexRoute component={MainHomePage} />
                <Route path='signup' component={MainSignUpPage}/>
                <Route path='recover-password' component={MainRecoverPasswordPage}/>
                <Route path='dashboard' component={DashboardLayout}>
                    <IndexRoute component={DashboardListTicketsPage} />
                    <Route path='articles' component={DashboardListArticlesPage}/>

                    <Route path='create-ticket' component={DashboardCreateTicketPage}/>
                    <Route path='edit-profile' component={DashboardEditProfilePage}/>

                    <Route path='article' component={DashboardArticlePage}/>
                    <Route path='ticket' component={DashboardTicketPage}/>
                </Route>
            </Route>

            <Route name='Demo' path='demo' component={DemoPage} />
        </Route>
    </Router>
);
