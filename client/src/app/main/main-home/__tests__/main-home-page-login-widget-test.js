const SessionActionsMock = require('actions/__mocks__/session-actions-mock');
const APICallMock = require('lib-app/__mocks__/api-call-mock');

const SubmitButton = ReactMock();
const Button = ReactMock();
const Input = ReactMock();
const Form = ReactMock();
const Checkbox = ReactMock();
const Message = ReactMock();
const Widget = ReactMock();
const WidgetTransition = ReactMock();
const PasswordRecovery = ReactMock({ focusEmail: stub() });

const MainHomePageLoginWidget = requireUnit('app/main/main-home/main-home-page-login-widget', {
    'react-redux': ReduxMock,
    'actions/session-actions': SessionActionsMock,
    'lib-app/api-call': APICallMock,
    'app-components/password-recovery': PasswordRecovery,
    'core-components/submit-button': SubmitButton,
    'core-components/button': Button,
    'core-components/input': Input,
    'core-components/form': Form,
    'core-components/checkbox': Checkbox,
    'core-components/message': Message,
    'core-components/widget': Widget,
    'core-components/widget-transition': WidgetTransition
});


describe('Login/Recover Widget', function () {
    describe('Login Form', function () {
        let loginWidget, loginForm, widgetTransition, inputs, checkbox, component,
            forgotPasswordButton, submitButton;

        let dispatch = stub();

        function renderComponent(props = {session: {pending: false, failed: false}}) {
            component = reRenderIntoDocument(
                <MainHomePageLoginWidget dispatch={dispatch} {...props}/>
            );
            widgetTransition = TestUtils.scryRenderedComponentsWithType(component, WidgetTransition)[0];
            loginWidget = TestUtils.scryRenderedComponentsWithType(component, Widget)[0];
            loginForm = TestUtils.scryRenderedComponentsWithType(component, Form)[0];
            inputs = TestUtils.scryRenderedComponentsWithType(component, Input);
            checkbox = TestUtils.scryRenderedComponentsWithType(component, Checkbox)[0];
            submitButton = TestUtils.scryRenderedComponentsWithType(component, SubmitButton)[0];
            forgotPasswordButton = TestUtils.scryRenderedComponentsWithType(component, Button)[0];

            component.refs.loginForm = {
                refs: {
                    password: {
                        focus: stub()
                    }
                }
            };
            component.refs.passwordRecovery = {
                focusEmail: stub()
            };
        }

        beforeEach(renderComponent);

        it('should control form errors by prop', function () {
            expect(loginForm.props.errors).to.deep.equal({});
            loginForm.props.onValidateErrors({email: 'MOCK_ERROR'});
            expect(loginForm.props.errors).to.deep.equal({email: 'MOCK_ERROR'});
        });

        it('should trigger login action when submitted', function () {
            let mockSubmitData = {email: 'MOCK_VALUE', password: 'MOCK_VALUE'};
            let actionMock = {};
            SessionActionsMock.login.returns(actionMock);
            dispatch.reset();

            loginForm.props.onSubmit(mockSubmitData);
            expect(SessionActionsMock.login).to.have.been.calledWith(mockSubmitData);
            expect(dispatch).to.have.been.calledWith(actionMock);
        });

        it('should set loading true if session login is pending', function () {
            expect(loginForm.props.loading).to.equal(false);
            renderComponent({
                session: {
                    pending: true,
                    failed: false
                }
            });
            expect(loginForm.props.loading).to.equal(true);
        });

        it('should add error and stop loading if login fails', function () {
            component.setState({
                loginFormErrors: {}
            });
            renderComponent({
                session: {
                    pending: false,
                    failed: true,
                    failMessage: 'INVALID_CREDENTIALS'
                }
            });
            expect(loginForm.props.errors).to.deep.equal({password: 'Invalid password'});
            expect(loginForm.props.loading).to.equal(false);
        });

        it('should show back side if \'Forgot your password?\' link is clicked', function () {
            expect(widgetTransition.props.sideToShow).to.equal('front');
            forgotPasswordButton.props.onClick();
            expect(widgetTransition.props.sideToShow).to.equal('back');
        });
    });

    describe('Recover Password form', function () {
        let recoverPassword, widgetTransition, component;

        let dispatch = stub();

        beforeEach(function () {
            component = TestUtils.renderIntoDocument(
                <MainHomePageLoginWidget dispatch={dispatch} session={{pending: false, failed: false}} />
            );
            widgetTransition = TestUtils.scryRenderedComponentsWithType(component, WidgetTransition)[0];
            recoverPassword = TestUtils.scryRenderedComponentsWithType(component, PasswordRecovery)[0];
        });

        it('should control form errors by prop', function () {
            expect(recoverPassword.props.formProps.errors).to.deep.equal({});
             recoverPassword.props.formProps.onValidateErrors({email: 'MOCK_ERROR'});
            expect(recoverPassword.props.formProps.errors).to.deep.equal({email: 'MOCK_ERROR'});
        });

        it('should call sendRecoverPassword when submitted', function () {
            let mockSubmitData = {email: 'MOCK_VALUE'};
            APICallMock.call.reset();

            recoverPassword.props.formProps.onSubmit(mockSubmitData);
            expect(APICallMock.call).to.have.been.calledWith({
                path: '/user/send-recover-password',
                data: mockSubmitData
            });
        });

        it('should set loading true in the form when submitted', function () {
            let mockSubmitData = {email: 'MOCK_VALUE'};

            recoverPassword.props.formProps.onSubmit(mockSubmitData);
            expect(recoverPassword.props.formProps.loading).to.equal(true);
        });

        it('should add error and stop loading when send recover fails', function () {
            component.onRecoverPasswordFail();
            expect(recoverPassword.props.formProps.errors).to.deep.equal({email: 'Email does not exist'});
            expect(recoverPassword.props.formProps.loading).to.equal(false);
        });

        it('should show front side if \'Back to login form\' link is clicked', function () {
            component.onBackToLoginClick();
            expect(widgetTransition.props.sideToShow).to.equal('front');
        });
    });
});
