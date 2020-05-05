import Validator from 'lib-app/validations/validator';
import EmailValidator from 'lib-app/validations/email-validator';
import RepeatPasswordValidator from 'lib-app/validations/repeat-password-validator';
import LengthValidator from 'lib-app/validations/length-validator';
import ListValidator from 'lib-app/validations/list-validator';
import ImageSizeValidator from 'lib-app/validations/image-size-validator';
import SpaceValidator from './space-validator';

const MIN_LENGTH_NAME = 1;
const MAX_LENGTH_NAME = 200;

const MIN_LENGTH_TITLE = 1;
const MAX_LENGTH_TITLE = 200;

const MIN_LENGTH_TEXT_AREA = 1;
const MAX_LENGTH_TEXT_AREA = 10000;

const MIN_LENGTH_PASSWORD = 6;
const MAX_LENGTH_PASSWORD = 200;

const MIN_LENGTH_URL = 5;
const MAX_LENGTH_URL = 200;

let validators = {
    'DEFAULT': new Validator(),
    'NAME': new LengthValidator(MIN_LENGTH_NAME, MAX_LENGTH_NAME, 'ERROR_NAME'),
    'TITLE': new LengthValidator(MIN_LENGTH_TITLE, MAX_LENGTH_TITLE, 'ERROR_TITLE'),
    'EMAIL': new EmailValidator(),
    'TEXT_AREA': new ImageSizeValidator(undefined, new LengthValidator(
        MIN_LENGTH_TEXT_AREA,
        MAX_LENGTH_TEXT_AREA,
        'ERROR_CONTENT_LENGTH'
    )),
    'PASSWORD': new LengthValidator(MIN_LENGTH_PASSWORD, MAX_LENGTH_PASSWORD, 'ERROR_PASSWORD'),
    'REPEAT_PASSWORD': new RepeatPasswordValidator(),
    'URL': new LengthValidator(MIN_LENGTH_URL, MAX_LENGTH_URL, 'ERROR_URL'),
    'LIST': new ListValidator()
};

class ValidatorFactory {

    static getValidator(validatorKey) {
        return validators[validatorKey];
    }
}

export default ValidatorFactory;
