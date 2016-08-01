import Validator from 'lib-app/validations/validator';

class EmailValidator extends Validator {

    validate(value, form) {
        if (!value.length) return this.getError('ERROR_EMPTY');
        if (value.indexOf('@') === -1) return this.getError('ERROR_EMAIL');
    }
}

export default EmailValidator;