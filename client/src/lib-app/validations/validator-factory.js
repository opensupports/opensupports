import Validator from 'lib-app/validations/validator';
import EmailValidator from 'lib-app/validations/email-validator';
import RepeatPasswordValidator from 'lib-app/validations/repeat-password-validator';
import LengthValidator from 'lib-app/validations/length-validator';
import ListValidator from 'lib-app/validations/list-validator';

let validators = {
    'DEFAULT': new Validator(),
    'NAME': new LengthValidator(2, 'ERROR_NAME'),
    'TITLE': new LengthValidator(1, 'ERROR_TITLE'),
    'EMAIL': new EmailValidator(),
    'TEXT_AREA': new LengthValidator(10, 'ERROR_CONTENT_SHORT'),
    'PASSWORD': new LengthValidator(6, 'ERROR_PASSWORD'),
    'REPEAT_PASSWORD': new RepeatPasswordValidator(),
    'URL': new LengthValidator(5, 'ERROR_URL'),
    'LIST': new ListValidator()
};

class ValidatorFactory {

    static getValidator(validatorKey) {
        return validators[validatorKey];
    }
}

export default ValidatorFactory;
