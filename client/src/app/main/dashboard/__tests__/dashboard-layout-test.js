const DashboardLayout = requireUnit('app/main/dashboard/dashboard-layout', {
    'app/main/dashboard/dashboard-menu': ReactMock()
});


describe('Dashboard page', function () {

    afterEach(function () {
        UserStore.isLoggedIn.returns(false);
    });

    it('should trigger common action if user is not logged', function () {
        CommonActions.loggedOut.reset();
        UserStore.isLoggedIn.returns(false);

        TestUtils.renderIntoDocument(<DashboardLayout />);
        expect(CommonActions.loggedOut).to.have.been.called;
    });

    it('should not trigger common action user if is logged', function () {
        CommonActions.loggedOut.reset();
        UserStore.isLoggedIn.returns(true);

        TestUtils.renderIntoDocument(<DashboardLayout />);
        expect(CommonActions.loggedOut).to.not.have.been.called;
    });
});