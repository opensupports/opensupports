import {EditorState} from 'draft-js';

import i18n from 'lib-app/i18n';

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
        if (value instanceof EditorState) {
            value = value.getCurrentContent().getPlainText()
        }

        if (value.length === 0) return this.getError('ERROR_EMPTY');
    }

    getError(errorKey) {
        return i18n(errorKey);
    }
}

export default Validator