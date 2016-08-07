const i18n = require('lib-app/i18n');

class Validator {
    constructor(validator = null) {
        this.previousValidator = validator;
    }
    
    performValidation(value, form) {
        let error;

        error = this.validate(value, form);

        if (this.previousValidator && !error) {
            error = this.previousValidator.validate(value, form);
        }

        return error;
    }

    validate(value, form) {
        if (!value.length) return this.getError('ERROR_EMPTY');
    }

    getError(errorKey) {
        return i18n(errorKey);
    }
}

export default Validator