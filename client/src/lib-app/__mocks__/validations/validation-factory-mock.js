let customValidatorMock = {performValidation: stub(), validate: stub()};
let defaultValidatorMock = {performValidation: stub(), validate: stub()};

export default {
    getValidator: spy(function (validation) {
        return (validation === 'CUSTOM') ? customValidatorMock : defaultValidatorMock;
    }),
    validators: {
        customValidatorMock: customValidatorMock,
        defaultValidatorMock: defaultValidatorMock
    }
};