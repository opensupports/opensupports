const UserActions = require('actions/__mocks__/user-actions-mock');
const UserStore = require('stores/__mocks__/user-store-mock');

const Button = ReactMock();
const Input = ReactMock();
const Form = ReactMock();
const Checkbox = ReactMock();
const Widget = ReactMock();
const WidgetTransition = ReactMock();

const MainHomePageLoginWidget = requireUnit('app/main/main-home/main-home-page-login-widget', {
    'core-components/button': Button,
    'core-components/input': Input,
    'core-components/form': Form,
    'core-components/checkbox': Checkbox,
    'core-components/widget': Widget,
    'core-components/widget-transition': WidgetTransition,
    'actions/user-actions': UserActions,
    'stores/user-store': UserStore
});


describe('Login/Recover Widget', function () {
    describe('Login Form', function () {
        let loginWidget, loginForm, widgetTransition, inputs, checkbox, component,
            forgotPasswordButton;

        beforeEach(function () {
            component = TestUtils.renderIntoDocument(
                <MainHomePageLoginWidget />
            );
            widgetTransition = TestUtils.scryRenderedComponentsWithType(component, WidgetTransition)[0];
            loginWidget = TestUtils.scryRenderedComponentsWithType(component, Widget)[0];
            loginForm = TestUtils.scryRenderedComponentsWithType(component, Form)[0];
            inputs = TestUtils.scryRenderedComponentsWithType(component, Input);
            checkbox = TestUtils.scryRenderedComponentsWithType(component, Checkbox)[0];
            forgotPasswordButton = TestUtils.scryRenderedComponentsWithType(component, Button)[1];

            component.refs.loginForm = {
                refs: {
                    password: {
                        focus: stub()
                    }
                }
            };
        });

        it('should control form errors by prop', function () {
            expect(loginForm.props.errors).to.deep.equal({});
            loginForm.props.onValidateErrors({email: 'MOCK_ERROR'});
            expect(loginForm.props.errors).to.deep.equal({email: 'MOCK_ERROR'});
        });

        it('should trigger login action when submitted', function () {
            let mockSubmitData = {email: 'MOCK_VALUE', password: 'MOCK_VALUE'};

            UserActions.login.reset();
            loginForm.props.onSubmit(mockSubmitData);
            expect(UserActions.login).to.have.been.calledWith(mockSubmitData);
        });
        
        it('should add error if login fails', function () {
            component.refs.loginForm.refs.password.focus.reset();
            component.onUserStoreChanged('LOGIN_FAIL');
            expect(loginForm.props.errors).to.deep.equal({password: 'Password does not match'});
            expect(component.refs.loginForm.refs.password.focus).to.have.been.called;
        });
        
        it('should show back side if \'Forgot your password?\' link is clicked', function () {
            expect(widgetTransition.props.sideToShow).to.equal('front');
            forgotPasswordButton.props.onClick();
            expect(widgetTransition.props.sideToShow).to.equal('back');
        });
    });
});