
const App = requireUnit('app/App', {

});

describe('App component', function () {
    describe('when reacting to CommonStore', function () {
        let app;

        beforeEach(function () {
            app = TestUtils.renderIntoDocument(
                <App><span>MOCK_CHILD</span></App>
            );

            app.context = {
                router: {
                    push: stub()
                },

                location: {
                    pathname: 'MOCK_PATH'
                }
            };

            spy(app, 'forceUpdate');
        });

        it('should update with i18n', function () {
            app.context.router.push.reset();
            app.forceUpdate.reset();
            app.onCommonStoreChanged('i18n');
            expect(app.context.router.push).to.have.been.calledWith('MOCK_PATH');
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
