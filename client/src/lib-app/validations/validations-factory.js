import Validator from 'lib-app/validations/validator';
import EmailValidator from 'lib-app/validations/email-validator';
import RepeatPasswordValidator from 'lib-app/validations/repeat-password-validator';
import LengthValidator from 'lib-app/validations/length-validator';

let validators = {
    'DEFAULT': new Validator(),
    'EMAIL': new EmailValidator(),
    'PASSWORD': new LengthValidator(6, 'ERROR_PASSWORD'),
    'REPEAT_PASSWORD': new RepeatPasswordValidator()
};

class ValidatorFactory {

    static getValidator(validatorKey) {
        return validators[validatorKey];
    }
}

export default ValidatorFactory;