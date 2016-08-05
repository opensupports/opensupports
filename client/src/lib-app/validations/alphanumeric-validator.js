import Validator from 'lib-app/validations/validator';

class AlphaNumericValidator extends Validator {
    constructor(errorKey = 'INVALID_VALUE', validator = null) {
        super(validator);

        this.errorKey = errorKey;
    }

    validate(value, form) {
        let alphaMatch = /^[-\sa-zA-Z.]+$/;

        if (!alphaMatch.test(value)) return this.getError(this.errorKey);
    }
}

export default AlphaNumericValidator;