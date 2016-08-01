import Validator from 'lib-app/validations/validator';

class EmailValidator extends Validator {

    validate(value, form) {
        if (value.length < 6) return this.getError('ERROR_EMAIL');
        if (value.indexOf('@') === -1) return this.getError('ERROR_EMAIL');
    }
}

export default EmailValidator;