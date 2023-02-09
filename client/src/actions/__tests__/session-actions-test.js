// const sessionStoreMock = require('lib-app/__mocks__/session-store-mock');
// const APICallMock = require('lib-app/__mocks__/api-call-mock');
// const storeMock = require('app/__mocks__/store-mock');

// const SessionActions = requireUnit('actions/session-actions', {
//     'lib-app/api-call': APICallMock,
//     'lib-app/session-store': sessionStoreMock,
//     'app/store': storeMock
// });

// describe('Session Actions,', function () {

//     describe('login action', function () {
//         it('should return LOGIN with with a result promise', function () {
//             APICallMock.call.returns({
//                 then: function (resolve) {
//                     resolve({
//                         data: {
//                             userId: 14,
//                             token: 'SOME_TOKEN'
//                         }
//                     });
//                 }
//             });

//             let loginData = {
//                 email: 'SOME_EMAIL',
//                 password: 'SOME_PASSWORD',
//                 remember: false
//             };

//             expect(SessionActions.login(loginData).type).to.equal('LOGIN');
//             expect(storeMock.dispatch).to.have.been.calledWithMatch({type: 'USER_DATA'});
//             expect(APICallMock.call).to.have.been.calledWith({
//                 path: '/user/get',
//                 data: {
//                     csrf_userid: 14,
//                     csrf_token: 'SOME_TOKEN'
//                 }
//             });
//         });
//     });

//     describe('autoLogin action', function () {
//         it('should return LOGIN_AUTO with remember data from sessionStore', function () {
//             APICallMock.call.returns({
//                 then: function (resolve) {
//                     resolve({
//                         data: {
//                             userId: 14
//                         }
//                     });
//                 }
//             });
//             sessionStoreMock.getRememberData.returns({
//                 token: 'SOME_TOKEN',
//                 userId: 'SOME_ID',
//                 expiration: 'SOME_EXPIRATION'
//             });

//             expect(SessionActions.autoLogin().type).to.equal('LOGIN_AUTO');
//             expect(storeMock.dispatch).to.have.been.calledWithMatch({type: 'USER_DATA'});
//             expect(APICallMock.call).to.have.been.calledWith({
//                 path: '/user/login',
//                 data: {
//                     rememberToken: 'SOME_TOKEN',
//                     userId: 'SOME_ID',
//                     remember: 1,
//                     isAutomatic: 1
//                 }
//             });
//         });
//     });

//     describe('logout action', function () {
//         it('should return LOGOUT and call /user/logout', function () {
//             APICallMock.call.returns('API_RESULT');
//             APICallMock.call.reset();

//             expect(SessionActions.logout()).to.deep.equal({
//                 type: 'LOGOUT',
//                 payload: 'API_RESULT'
//             });
//             expect(APICallMock.call).to.have.been.calledWith({
//                 path: '/user/logout',
//                 data: {}
//             });
//         });
//     });

//     describe('checkSession action', function () {
//         beforeEach(function () {
//             APICallMock.call.returns({
//                 then: function (resolve) {
//                     resolve({
//                         data: {
//                             sessionActive: false
//                         }
//                     });
//                 }
//             });
//             APICallMock.call.reset();
//             storeMock.dispatch.reset();
//             sessionStoreMock.isLoggedIn.returns(true)
//         });

//         after(function () {
//             APICallMock.call.returns(new Promise(function (resolve) {
//                  resolve({
//                      data: {
//                          sessionActive: true
//                      }
//                  });
//              }));
//         });

//         it('should return CHECK_SESSION and dispatch SESSION_CHECKED if session is active', function () {
//             APICallMock.call.returns({
//                 then: function (resolve) {
//                     resolve({
//                         data: {
//                             sessionActive: true
//                         }
//                     });
//                 }
//             });

//             expect(SessionActions.checkSession().type).to.equal('CHECK_SESSION');
//             expect(storeMock.dispatch).to.have.been.calledWith({type: 'SESSION_CHECKED'});
//             expect(APICallMock.call).to.have.been.calledWith({
//                 path: '/user/check-session',
//                 data: {}
//             });
//         });

//         it('should return CHECK_SESSION and dispatch LOGOUT_FULFILLED if session is not active and no remember data', function () {
//             sessionStoreMock.isRememberDataExpired.returns(true);

//             expect(SessionActions.checkSession().type).to.equal('CHECK_SESSION');
//             expect(storeMock.dispatch).to.have.been.calledWith({type: 'LOGOUT_FULFILLED'});
//             expect(APICallMock.call).to.have.been.calledWith({
//                 path: '/user/check-session',
//                 data: {}
//             });
//         });

//         it('should return CHECK_SESSION and dispatch LOGIN_AUTO if session is not active but remember data exists', function () {
//             sessionStoreMock.isRememberDataExpired.returns(false);

//             expect(SessionActions.checkSession().type).to.equal('CHECK_SESSION');
//             expect(storeMock.dispatch).to.not.have.been.calledWith({type: 'LOGOUT_FULFILLED'});
//             expect(APICallMock.call).to.have.been.calledWith({
//                 path: '/user/check-session',
//                 data: {}
//             });

//             expect(storeMock.dispatch).to.have.been.calledWith(SessionActions.autoLogin());
//         });
//     });
// });
