import Validator from 'lib-app/validations/validator';
import AlphaNumericValidator from 'lib-app/validations/alphanumeric-validator';
import EmailValidator from 'lib-app/validations/email-validator';
import RepeatPasswordValidator from 'lib-app/validations/repeat-password-validator';
import LengthValidator from 'lib-app/validations/length-validator';

let validators = {
    'DEFAULT': new Validator(),
    'NAME': new AlphaNumericValidator('ERROR_NAME', new LengthValidator(2, 'ERROR_NAME')),
    'EMAIL': new EmailValidator(),
    'TEXT_AREA': new LengthValidator(10, 'ERROR_CONTENT_SHORT'),
    'PASSWORD': new LengthValidator(6, 'ERROR_PASSWORD'),
    'REPEAT_PASSWORD': new RepeatPasswordValidator()
};

class ValidatorFactory {

    static getValidator(validatorKey) {
        return validators[validatorKey];
    }
}

export default ValidatorFactory;