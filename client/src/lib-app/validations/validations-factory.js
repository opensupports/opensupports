const Validator = require('lib-app/validations/validator');
const EmailValidator = require('lib-app/validations/email-validator');

let validators = {
    'DEFAULT': new Validator(),
    'EMAIL': new EmailValidator()
};

class ValidatorFactory {

    static getValidator(validatorKey) {
        return validators[validatorKey];
    }
}

export default ValidatorFactory;