import Validator from 'lib-app/validations/validator';

class EmailValidator extends Validator {

    validate(value, form) {
        let emailMatch = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!emailMatch.test(value)) return this.getError('ERROR_EMAIL');
    }
}

export default EmailValidator;