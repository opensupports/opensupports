import Validator from 'lib-app/validations/validator';

class RepeatPasswordValidator extends Validator {

    validate(value, form) {
        if (value !== form.password) return this.getError('PASSWORD_NOT_MATCH');
    }
}

export default RepeatPasswordValidator;