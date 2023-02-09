import Validator from 'lib-app/validations/validator';
import _ from 'lodash';

class LengthValidator extends Validator {
    constructor(length, errorKey = 'INVALID_VALUE', validator = null, useHTMLDiv = false) {
        super(validator);

        this.minlength = length;
        this.errorKey = errorKey;
        this.useHTMLDiv = useHTMLDiv;
    }

    validate(value = '', form = {}) {
        let text;
        if (this.useHTMLDiv) {
            let div = document.createElement("div");
            div.innerHTML = value;
            text = div.textContent || div.innerText || "";
        } else {
            text = value;
        }

        if(_.every(text, c => c === " ")) {
            text = text.replace(/\s/g, '');
        }
        if(text.length < this.minlength) return this.getError(this.errorKey);
    }
}

export default LengthValidator;
