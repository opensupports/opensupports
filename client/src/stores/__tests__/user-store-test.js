// MOCKS
const CommonActions = require('actions/__mocks__/common-actions-mock');
const SessionStore = require('lib-app/__mocks__/session-store-mock');
const API = require('lib-app/__mocks__/api-call-mock');
const UserActions = {
    checkLoginStatus: {listen: stub()},
    login: {listen: stub()},
    logout: {listen: stub()}
};

const UserStore = requireUnit('stores/user-store', {
    'actions/user-actions': UserActions,
    'actions/common-actions': CommonActions,
    'lib-app/session-store': SessionStore,
    'lib-app/api-call': API
});

describe('UserStore', function () {
    describe('when login user', function () {
        it('should call /user/login api path', function () {
            let mockLoginData = {email: 'mock', password: 'mock'};

            UserStore.loginUser(mockLoginData);
            expect(API.call).to.have.been.calledWith({
                path: 'user/login',
                data: mockLoginData,
                onSuccess: sinon.match.func,
                onFail: sinon.match.func
            });
        });

        it('should create session, trigger success event and inform common action when having a successful login', function () {
            let mockLoginData = {email: 'mock', password: 'mock'};
            let mockSuccessData = {
                status: 'success',
                data: {
                    userId: 12,
                    token: 'RANDOM_TOKEN'
                }
            };

            spy(UserStore, 'trigger');
            CommonActions.logged.reset();
            SessionStore.createSession.reset();
            API.call = ({onSuccess}) => {onSuccess(mockSuccessData)};

            UserStore.loginUser(mockLoginData);

            expect(SessionStore.createSession).to.have.been.calledWith(12, 'RANDOM_TOKEN');
            expect(UserStore.trigger).to.have.been.calledWith('LOGIN_SUCCESS');
            expect(CommonActions.logged).to.have.been.called;
            UserStore.trigger.restore();
        });

        it('should trigger fail event if login fails', function () {
            let mockLoginData = {email: 'mock', password: 'mock'};
            let mockSuccessData = {
                status: 'success',
                data: {
                    userId: 12,
                    token: 'RANDOM_TOKEN'
                }
            };

            spy(UserStore, 'trigger');
            API.call = ({onFail}) => {onFail(mockSuccessData)};

            UserStore.loginUser(mockLoginData);

            expect(UserStore.trigger).to.have.been.calledWith('LOGIN_FAIL');
            UserStore.trigger.restore();
        });
    });

    describe('when login out', function () {

        it('should call /user/logout api path', function () {
            API.call = stub();

            UserStore.logoutUser();
            expect(API.call).to.have.been.calledWith({
                path: 'user/logout',
                onSuccess: sinon.match.func
            });
        });

        it('should delete session, trigger LOGOUT event and inform common action of logout', function () {
            API.call = ({onSuccess}) => {onSuccess()};
            spy(UserStore, 'trigger');

            UserStore.logoutUser();
            expect(SessionStore.closeSession).to.have.been.called;
            expect(UserStore.trigger).to.have.been.calledWith('LOGOUT');
            expect(CommonActions.loggedOut).to.have.been.called;
            UserStore.trigger.restore()
        })
    });

    it ('should inform is the user is logged based on SessionStores\' info', function () {
        SessionStore.isLoggedIn.returns(true);
        expect(UserStore.isLoggedIn()).to.equal(true);
        SessionStore.isLoggedIn.returns(false);
        expect(UserStore.isLoggedIn()).to.equal(false);
    });
});
