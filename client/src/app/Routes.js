import React from 'react';
import {Router, Route, IndexRoute, IndexRedirect} from 'react-router';

import App from 'app/App';
import DemoPage from 'app/demo/components-demo-page';
import history from 'lib-app/history';

import MainLayout from 'app/main/main-layout';
import MainHomePage from 'app/main/main-home/main-home-page';
import MainSignUpPage from 'app/main/main-signup/main-signup-page';
import MainVerifyTokenPage from 'app/main/main-verify-token-page';
import MainRecoverPasswordPage from 'app/main/main-recover-password/main-recover-password-page';
import MainMaintenancePage from 'app/main/main-maintenance-page';
import MainCheckTicketPage from 'app/main/main-check-ticket-page';
import MainViewTicketPage from 'app/main/main-view-ticket-page';

import DashboardLayout from 'app/main/dashboard/dashboard-layout';
import DashboardListTicketsPage from 'app/main/dashboard/dashboard-list-tickets/dashboard-list-tickets-page';
import DashboardListArticlesPage from 'app/main/dashboard/dashboard-list-articles/dashboard-list-articles-page';
import DashboardCreateTicketPage from 'app/main/dashboard/dashboard-create-ticket/dashboard-create-ticket-page';
import DashboardEditProfilePage from 'app/main/dashboard/dashboard-edit-profile/dashboard-edit-profile-page';
import DashboardArticlePage from 'app/main/dashboard/dashboard-article/dashboard-article-page';
import DashboardTicketPage from 'app/main/dashboard/dashboard-ticket/dashboard-ticket-page';

// ADMIN PANEL
import AdminLoginPage from 'app/admin/admin-login-page';
import AdminPanelLayout from 'app/admin/panel/admin-panel-layout';

import AdminPanelStats from 'app/admin/panel/dashboard/admin-panel-stats';
import AdminPanelActivity from 'app/admin/panel/dashboard/admin-panel-activity';
import AdminPanelMyAccount from 'app/admin/panel/dashboard/admin-panel-my-account';

import AdminPanelMyTickets from 'app/admin/panel/tickets/admin-panel-my-tickets';
import AdminPanelNewTickets from 'app/admin/panel/tickets/admin-panel-new-tickets';
import AdminPanelSearchTickets from 'app/admin/panel/tickets/admin-panel-search-tickets';
import AdminPanelViewTicket from 'app/admin/panel/tickets/admin-panel-view-ticket';
import AdminPanelCustomResponses from 'app/admin/panel/tickets/admin-panel-custom-responses';

import AdminPanelListUsers from 'app/admin/panel/users/admin-panel-list-users';
import AdminPanelViewUser from 'app/admin/panel/users/admin-panel-view-user';
import AdminPanelBanUsers from 'app/admin/panel/users/admin-panel-ban-users';
import AdminPanelCustomFields from 'app/admin/panel/users/admin-panel-custom-fields';

import AdminPanelListArticles from 'app/admin/panel/articles/admin-panel-list-articles';
import AdminPanelViewArticle from 'app/admin/panel/articles/admin-panel-view-article';

import AdminPanelStaffMembers from 'app/admin/panel/staff/admin-panel-staff-members';
import AdminPanelDepartments from 'app/admin/panel/staff/admin-panel-departments';
import AdminPanelViewStaff from 'app/admin/panel/staff/admin-panel-view-staff';

import AdminPanelSystemPreferences from 'app/admin/panel/settings/admin-panel-system-preferences';
import AdminPanelAdvancedSettings from 'app/admin/panel/settings/admin-panel-advanced-settings';
import AdminPanelEmailSettings from 'app/admin/panel/settings/admin-panel-email-settings';
import AdminPanelCustomTags from 'app/admin/panel/settings/admin-panel-custom-tags';

// INSTALLATION
import InstallLayout from 'app/install/install-layout';
import InstallStep1Language from 'app/install/install-step-1-language';
import InstallStep2Requirements from 'app/install/install-step-2-requirements';
import InstallStep3Database from 'app/install/install-step-3-database';
import InstallStep4UserSystem from 'app/install/install-step-4-user-system';
import InstallStep5Settings from 'app/install/install-step-5-settings';
import InstallStep6Admin from 'app/install/install-step-6-admin';
import InstallCompleted from 'app/install/install-completed';

export default (
    <Router history={history}>
        <Route component={App}>
            <Route path='/' component={MainLayout}>
                <IndexRoute component={MainHomePage} />
                <Route path='signup' component={MainSignUpPage}/>
                <Route path='verify-token/:email/:token' component={MainVerifyTokenPage}/>
                <Route path='recover-password' component={MainRecoverPasswordPage}/>
                <Route path='maintenance' component={MainMaintenancePage}/>

                <Route path='create-ticket' component={DashboardCreateTicketPage}/>
                <Route path='check-ticket(/:ticketNumber/:email)' component={MainCheckTicketPage}/>
                <Route path='view-ticket/:ticketNumber' component={MainViewTicketPage}/>
                <Route path='articles' component={DashboardListArticlesPage}/>
                <Route path='article/:articleId' component={DashboardArticlePage}/>

                <Route path='dashboard' component={DashboardLayout}>
                    <IndexRoute component={DashboardListTicketsPage} />
                    <Route path='articles' component={DashboardListArticlesPage}/>

                    <Route path='create-ticket' component={DashboardCreateTicketPage}/>
                    <Route path='edit-profile' component={DashboardEditProfilePage}/>

                    <Route path='article/:articleId' component={DashboardArticlePage}/>
                    <Route path='ticket/:ticketNumber' component={DashboardTicketPage}/>
                </Route>
            </Route>
            <Route path="install" component={InstallLayout}>
                <IndexRedirect to="step-1" />
                <Route path="step-1" component={InstallStep1Language}/>
                <Route path="step-2" component={InstallStep2Requirements} />
                <Route path="step-3" component={InstallStep3Database} />
                <Route path="step-4" component={InstallStep4UserSystem} />
                <Route path="step-5" component={InstallStep5Settings} />
                <Route path="step-6" component={InstallStep6Admin} />
                <Route path="completed" component={InstallCompleted} />
            </Route>
            <Route path="admin">
                <IndexRoute component={AdminLoginPage} />
                <Route path="panel" component={AdminPanelLayout}>
                    <IndexRedirect to="activity" />
                    <Route path="stats" component={AdminPanelStats} />
                    <Route path="activity" component={AdminPanelActivity} />
                    <Route path="my-account" component={AdminPanelMyAccount} />

                    <Route path="tickets">
                        <IndexRedirect to="my-tickets" />
                        <Route path="my-tickets" component={AdminPanelMyTickets} />
                        <Route path="new-tickets" component={AdminPanelNewTickets} />
                        <Route path="search-tickets" component={AdminPanelSearchTickets} />
                        <Route path="custom-responses" component={AdminPanelCustomResponses} />
                        <Route path="view-ticket/:ticketNumber" component={AdminPanelViewTicket} />
                    </Route>

                    <Route path="users">
                        <IndexRedirect to="list-users" />
                        <Route path="list-users" component={AdminPanelListUsers} />
                        <Route path="view-user/:userId" component={AdminPanelViewUser} />
                        <Route path="ban-users" component={AdminPanelBanUsers} />
                        <Route path="custom-fields" component={AdminPanelCustomFields} />
                    </Route>

                    <Route path="articles">
                        <IndexRedirect to="list-articles" />
                        <Route path="list-articles" component={AdminPanelListArticles} />
                        <Route path="view-article/:articleId" component={AdminPanelViewArticle} />
                    </Route>

                    <Route path="staff">
                        <IndexRedirect to="staff-members" />
                        <Route path="staff-members" component={AdminPanelStaffMembers} />
                        <Route path="view-staff/:staffId" component={AdminPanelViewStaff} />
                        <Route path="departments" component={AdminPanelDepartments} />
                    </Route>

                    <Route path="settings">
                        <IndexRedirect to="system-preferences" />
                        <Route path="system-preferences" component={AdminPanelSystemPreferences} />
                        <Route path="advanced-settings" component={AdminPanelAdvancedSettings} />
                        <Route path="email-settings" component={AdminPanelEmailSettings} />
                        <Route path="custom-tags" component={AdminPanelCustomTags} />
                    </Route>
                </Route>
            </Route>

            <Route name='Demo' path='components-demo' component={DemoPage} />
        </Route>
    </Router>
);
