const APICallMock = require('lib-app/__mocks__/api-call-mock');

const SubmitButton = ReactMock();
const Button = ReactMock();
const Input = ReactMock();
const Form = ReactMock();
const Checkbox = ReactMock();
const Message = ReactMock();
const FormField = ReactMock();
const Widget = ReactMock();

const PasswordRecovery = requireUnit('app-components/password-recovery', {
    'lib-app/api-call': APICallMock,
    'core-components/submit-button': SubmitButton,
    'core-components/button': Button,
    'core-components/form-field': FormField,
    'core-components/': FormField,
    'core-components/form': Form,
    'core-components/checkbox': Checkbox,
    'core-components/message': Message,
    'core-components/widget': Widget,
});

describe('PasswordRecovery component', function () {
    let recoverWidget, recoverForm, widgetTransition, emailInput, component,
        backToLoginButton, submitButton;

    let dispatch = stub();

    beforeEach(function () {
        component = TestUtils.renderIntoDocument(
            <PasswordRecovery />
        );
        recoverWidget = TestUtils.scryRenderedComponentsWithType(component, Widget)[0];
        recoverForm = TestUtils.scryRenderedComponentsWithType(component, Form)[0];
        emailInput = TestUtils.scryRenderedComponentsWithType(component, Input)[0];
        submitButton = TestUtils.scryRenderedComponentsWithType(component, SubmitButton)[0];
        backToLoginButton = TestUtils.scryRenderedComponentsWithType(component, Button)[0];
    });

    it('should control form errors by prop', function () {
        expect(recoverForm.props.errors).to.deep.equal({});
        recoverForm.props.onValidateErrors({email: 'MOCK_ERROR'});
        expect(recoverForm.props.errors).to.deep.equal({email: 'MOCK_ERROR'});
    });

    it('should call sendRecoverPassword when submitted', function () {
        let mockSubmitData = {email: 'MOCK_VALUE'};
        APICallMock.call.reset();

        recoverForm.props.onSubmit(mockSubmitData);
        expect(APICallMock.call).to.have.been.calledWith({
            path: '/user/send-recover-password',
            data: mockSubmitData
        });
    });

    it('should set loading true in the form when submitted', function () {
        let mockSubmitData = {email: 'MOCK_VALUE'};

        recoverForm.props.onSubmit(mockSubmitData);
        expect(recoverForm.props.loading).to.equal(true);
    });

    it('should add error and stop loading when send recover fails', function () {
        component.refs.recoverForm.refs.email.focus.reset();

        component.onRecoverPasswordFail();
        expect(recoverForm.props.errors).to.deep.equal({email: 'EMAIL_NOT_EXIST'});
        expect(recoverForm.props.loading).to.equal(false);
        expect(component.refs.recoverForm.refs.email.focus).to.have.been.called;
    });

    it('should show message when send recover success', function () {
        let message = TestUtils.scryRenderedComponentsWithType(component, Message)[0];
        expect(message).to.equal(undefined);

        component.onRecoverPasswordSent();
        message = TestUtils.scryRenderedComponentsWithType(component, Message)[0];

        expect(recoverForm.props.loading).to.equal(false);
        expect(message).to.not.equal(null);
        expect(message.props.type).to.equal('info');
        expect(message.props.children).to.equal('RECOVER_SENT');
    });

    it('should show front side if \'Back to login form\' link is clicked', function () {
        backToLoginButton.props.onClick();
        expect(widgetTransition.props.sideToShow).to.equal('front');
    });
});
