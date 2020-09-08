import Validator from 'lib-app/validations/validator';
import _ from 'lodash';

class LengthValidator extends Validator {
    constructor(minLength, maxLength, errorKey = 'INVALID_VALUE', validator = null) {
        super(validator);

        this.minLength = minLength;
        this.maxLength = maxLength;
        this.errorKey = errorKey;
    }

    validate(value = '', form = {}) {
        let div = document.createElement("div");
        div.innerHTML = value;
        let text = div.textContent || div.innerText || "";
        if(_.every(text, c => c === " ")) {
            text = text.replace(/\s/g, '');
        }
        if(text.length < this.minLength || this.maxLength < text.length) return this.getError(this.errorKey);
    }
}

export default LengthValidator;
