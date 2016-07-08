const CommonStore = require('stores/__mocks__/common-store-mock');

const App = requireUnit('app/App', {
    'store/common-store': CommonStore
});

describe('App component', function () {
    describe('when reacting to CommonStore', function () {
        let app;

        beforeEach(function () {
            console.log(App);
            app = TestUtils.renderIntoDocument(
                <App><span>MOCK_CHILD</span></App>
            );

            app.context = {
                router: {
                    push: stub()
                }
            };

            spy(app, 'forceUpdate');
        });

        it('should update with i18n', function () {
            app.forceUpdate.reset();
            app.onCommonStoreChanged('i18n');
            expect(app.forceUpdate).to.have.been.called;
        });

        it('should redirect when logged in', function () {
            app.context.router.push.reset();
            app.onCommonStoreChanged('logged');
            expect(app.context.router.push).to.have.been.calledWith('/app/dashboard');
        });

        it('should redirect when logged out', function () {
            app.context.router.push.reset();
            app.onCommonStoreChanged('loggedOut');
            expect(app.context.router.push).to.have.been.calledWith('/app');
        });
    });
});
