import Validator from 'lib-app/validations/validator';

class LengthValidator extends Validator {
    constructor(length, errorKey = 'INVALID_VALUE') {
        super();
        
        this.minlength = length;
        this.errorKey = errorKey;
    }

    validate(value, form) {
        if (value.length < this.minlength) return this.getError(this.errorKey);
    }
}

export default LengthValidator;