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
    it ('should inform is the user is logged based on SessionStores\' info', function () {
        SessionStore.isLoggedIn.returns(true);
        expect(UserStore.isLoggedIn()).to.equal(true);
        SessionStore.isLoggedIn.returns(false);
        expect(UserStore.isLoggedIn()).to.equal(false);
    });

    describe('when login user', function () {
        it('should call /user/login api path', function () {
            let mockLoginData = {email: 'mock', password: 'mock'};

            UserStore.loginUser(mockLoginData);
            expect(API.call).to.have.been.calledWith({
                path: 'user/login',
                data: mockLoginData
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
            API.call.returns({
                then: (resolve) => {resolve(mockSuccessData)}
            });

            UserStore.loginUser(mockLoginData);

            expect(SessionStore.storeRememberData).to.have.not.been.called;
            expect(SessionStore.createSession).to.have.been.calledWith(12, 'RANDOM_TOKEN');
            expect(UserStore.trigger).to.have.been.calledWith('LOGIN_SUCCESS');
            expect(CommonActions.logged).to.have.been.called;
            UserStore.trigger.restore();
        });

        it('should trigger fail event if login fails', function () {
            let mockLoginData = {email: 'mock', password: 'mock'};

            spy(UserStore, 'trigger');
            API.call.returns({
                then: (resolve, reject) => {reject()}
            });

            UserStore.loginUser(mockLoginData);

            expect(UserStore.trigger).to.have.been.calledWith('LOGIN_FAIL');
            UserStore.trigger.restore();
        });

        it('should store remember data if remember is true', function () {
            let mockLoginData = {email: 'mock', password: 'mock', remember: true};
            let mockSuccessData = {
                status: 'success',
                data: {
                    userId: 12,
                    token: 'RANDOM_TOKEN',
                    rememberToken: 'RANDOM_TOKEN_2',
                    rememberExpiration: 20150822
                }
            };

            spy(UserStore, 'trigger');
            CommonActions.logged.reset();
            SessionStore.createSession.reset();
            API.call.returns({
                then: (resolve) => {resolve(mockSuccessData)}
            });

            UserStore.loginUser(mockLoginData);

            expect(SessionStore.storeRememberData).to.have.been.calledWith({
                token: 'RANDOM_TOKEN_2',
                userId: 12,
                expiration: 20150822
            });
            expect(SessionStore.createSession).to.have.been.calledWith(12, 'RANDOM_TOKEN');
            expect(UserStore.trigger).to.have.been.calledWith('LOGIN_SUCCESS');
            expect(CommonActions.logged).to.have.been.called;
            UserStore.trigger.restore();
        });
    });

    describe('when login out', function () {

        it('should call /user/logout api path', function () {
            API.call = stub().returns({
                then: (resolve) => {resolve()}
            });

            UserStore.logoutUser();
            expect(API.call).to.have.been.calledWith({
                path: 'user/logout'
            });
        });

        it('should delete session, trigger LOGOUT event and inform common action of logout', function () {
            API.call = stub().returns({
                then: (resolve) => {resolve()}
            });
            spy(UserStore, 'trigger');

            UserStore.logoutUser();
            expect(SessionStore.closeSession).to.have.been.called;
            expect(UserStore.trigger).to.have.been.calledWith('LOGOUT');
            expect(CommonActions.loggedOut).to.have.been.called;
            UserStore.trigger.restore()
        })
    });

    describe('when calling initSession', function () {{

        it('should check if session is active in the API', function () {
            let mockSuccessData = {
                status: 'success',
                data: {
                    sessionActive: true
                }
            };
            API.call = stub().returns({
                then: (resolve) => {resolve(mockSuccessData)}
            });

            UserStore.initSession();

            expect(API.call).to.have.been.calledWith({
                path: 'user/check-session',
                data: {}
            });
        });

        describe('and no session is active', function () {
            beforeEach(function() {
                let mockSuccessData = {
                    status: 'success',
                    data: {
                        sessionActive: false
                    }
                };
                API.call = stub().returns({
                    then: (resolve) => {resolve(mockSuccessData)}
                });
            });

            it('should log out and delete remember data if expired', function () {
                SessionStore.isRememberDataExpired.returns(true);
                SessionStore.clearRememberData.reset();

                UserStore.initSession();

                expect(SessionStore.clearRememberData).to.have.been.called;
                expect(SessionStore.closeSession).to.have.been.called;
                expect(CommonActions.loggedOut).to.have.been.called;
            });

            it('should login with remember data', function () {
                SessionStore.isRememberDataExpired.returns(false);
                SessionStore.getRememberData.returns({
                    userId: 'REMEMBER_USER_ID',
                    token: 'REMEMBER_TOKEN',
                    expiration: 20160721
                });

                UserStore.initSession();

                expect(API.call).to.have.been.calledWithMatch({
                    path: 'user/login',
                    data: {
                        userId: 'REMEMBER_USER_ID',
                        rememberToken: 'REMEMBER_TOKEN'
                    }
                });
            });
        });
    }})
});
