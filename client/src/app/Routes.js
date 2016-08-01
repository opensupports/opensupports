const React = require('react');
const {Router, Route, IndexRoute, browserHistory} = require('react-router');

const App = require('app/App');
const DemoPage = require('app/demo/components-demo-page');

const MainLayout = require('app/main/main-layout');
const MainHomePage = require('app/main/main-home/main-home-page');
const MainSignUpPage = require('app/main/main-signup/main-signup-page');
const MainRecoverPasswordPage = require('app/main/main-recover-password/main-recover-password-page');

const DashboardLayout = require('app/main/dashboard/dashboard-layout');

const DashboardListTicketsPage = require('app/main/dashboard/dashboard-list-tickets/dashboard-list-tickets-page');
const DashboardListArticlesPage = require('app/main/dashboard/dashboard-list-articles/dashboard-list-articles-page');

const DashboardCreateTicketPage = require('app/main/dashboard/dashboard-create-ticket/dashboard-create-ticket-page');
const DashboardEditProfilePage = require('app/main/dashboard/dashboard-edit-profile/dashboard-edit-profile-page');

const DashboardArticlePage = require('app/main/dashboard/dashboard-article/dashboard-article-page');
const DashboardTicketPage = require('app/main/dashboard/dashboard-ticket/dashboard-ticket-page');

export default (
    <Router history={browserHistory}>
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
