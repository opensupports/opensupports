const sessionStoreMock = require('lib-app/__mocks__/session-store-mock');
const APICallMock = require('lib-app/__mocks__/api-call-mock');
const storeMock = {
    dispatch: stub()
};

const SessionActions = requireUnit('actions/session-actions', {
    'lib-app/api-call': APICallMock,
    'lib-app/session-store': sessionStoreMock,
    'app/store': storeMock
});

describe('Session Actions,', function () {
    APICallMock.call.returns('API_RESULT');

    describe('login action', function () {
        it('should return LOGIN with with API_RESULT promise', function () {
            APICallMock.call.reset();
            let loginData = {
                email: 'SOME_EMAIL',
                password: 'SOME_PASSWORD',
                remember: false
            };

            expect(SessionActions.login(loginData)).to.deep.equal({
                type: 'LOGIN',
                payload: 'API_RESULT'
            });

            expect(APICallMock.call).to.have.been.calledWith({
                path: '/user/login',
                data: loginData
            });
        });
    });

    describe('autoLogin action', function () {
        it('should return LOGIN_AUTO with remember data from sessionStore', function () {
            APICallMock.call.reset();
            sessionStoreMock.getRememberData.returns({
                token: 'SOME_TOKEN',
                userId: 'SOME_ID',
                expiration: 'SOME_EXPIRATION'
            });

            expect(SessionActions.autoLogin()).to.deep.equal({
                type: 'LOGIN_AUTO',
                payload: 'API_RESULT'
            });
            expect(APICallMock.call).to.have.been.calledWith({
                path: '/user/login',
                data: {
                    rememberToken: 'SOME_TOKEN',
                    userId: 'SOME_ID',
                    isAutomatic: true
                }
            });
        });
    });

    describe('logout action', function () {
        it('should return LOGOUT and call /user/logout', function () {
            APICallMock.call.reset();

            expect(SessionActions.logout()).to.deep.equal({
                type: 'LOGOUT',
                payload: 'API_RESULT'
            });
            expect(APICallMock.call).to.have.been.calledWith({
                path: '/user/logout',
                data: {}
            });
        });
    });

    describe('initSession action', function () {
        beforeEach(function () {
            APICallMock.call.returns({
                then: function (resolve) {
                    resolve({
                        data: {
                            sessionActive: false
                        }
                    });
                }
            });
            APICallMock.call.reset();
            storeMock.dispatch.reset();
        });

        after(function () {
            APICallMock.call.returns(new Promise(function (resolve) {
                 resolve({
                     data: {
                         sessionActive: true
                     }
                 });
             }));
        });

        it('should return CHECK_SESSION and dispatch SESSION_ACTIVE if session is active', function () {
            APICallMock.call.returns({
                then: function (resolve) {
                    resolve({
                        data: {
                            sessionActive: true
                        }
                    });
                }
            });

            expect(SessionActions.initSession().type).to.equal('CHECK_SESSION');
            expect(storeMock.dispatch).to.have.been.calledWith({type: 'SESSION_CHECKED'});
            expect(APICallMock.call).to.have.been.calledWith({
                path: '/user/check-session',
                data: {}
            });
        });

        it('should return CHECK_SESSION and dispatch LOGOUT_FULFILLED if session is not active and no remember data', function () {
            sessionStoreMock.isRememberDataExpired.returns(true);

            expect(SessionActions.initSession().type).to.equal('CHECK_SESSION');
            expect(storeMock.dispatch).to.have.been.calledWith({type: 'LOGOUT_FULFILLED'});
            expect(APICallMock.call).to.have.been.calledWith({
                path: '/user/check-session',
                data: {}
            });
        });

        it('should return CHECK_SESSION and dispatch LOGIN_AUTO if session is not active but remember data exists', function () {
            sessionStoreMock.isRememberDataExpired.returns(false);

            expect(SessionActions.initSession().type).to.equal('CHECK_SESSION');
            expect(storeMock.dispatch).to.not.have.been.calledWith({type: 'LOGOUT_FULFILLED'});
            expect(APICallMock.call).to.have.been.calledWith({
                path: '/user/check-session',
                data: {}
            });

            expect(storeMock.dispatch).to.have.been.calledWith(SessionActions.autoLogin());
        });
    });
});