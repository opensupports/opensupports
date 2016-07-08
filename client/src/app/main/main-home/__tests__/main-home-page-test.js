const CommonActions = require('actions/__mocks__/common-actions-mock');
const UserStore = require('stores/__mocks__/user-store-mock');

const MainHomePage = requireUnit('app/main/main-home/main-home-page', {
    'actions/common-actions': CommonActions,
    'stores/user-store': UserStore
});


describe('Main home page', function () {

    afterEach(function () {
        UserStore.isLoggedIn.returns(false);
    });

    it('should trigger common action if user is currently logged', function () {
        CommonActions.logged.reset();
        UserStore.isLoggedIn.returns(true);

        TestUtils.renderIntoDocument(<MainHomePage />);
        expect(CommonActions.logged).to.have.been.called;
    });

    it('should not trigger common action user if is not logged', function () {
        CommonActions.logged.reset();
        UserStore.isLoggedIn.returns(false);

        TestUtils.renderIntoDocument(<MainHomePage />);
        expect(CommonActions.logged).to.not.have.been.called;
    });
});