import Validator from 'lib-app/validations/validator';

class SpaceValidator extends Validator {
    constructor(errorKey = 'INVALID_VALUE', validator = null) {
        super(validator);

        this.errorKey = errorKey;
    }

    validate(value = '', form = {}) {
        let div = document.createElement("div");
        div.innerHTML = value;
        let text = div.textContent || div.innerText || "";

        if (text.replace(/\s/g, '').length < 1) return this.getError(this.errorKey);
    }
}

export default SpaceValidator;
