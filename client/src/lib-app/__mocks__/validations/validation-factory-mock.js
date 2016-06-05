let customValidatorMock = {validate: stub()};
let defaultValidatorMock = {validate: stub()};

export default {
    getValidator: spy(function (validation) {
        return (validation === 'CUSTOM') ? customValidatorMock : defaultValidatorMock;
    }),
    validators: {
        customValidatorMock: customValidatorMock,
        defaultValidatorMock: defaultValidatorMock
    }
};