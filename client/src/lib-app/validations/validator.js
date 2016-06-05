const i18n = require('lib-app/i18n');

class Validator {
    validate(value, form) {
        if (!value.length) return this.getError('ERROR_EMPTY');
    }

    getError(errorKey) {
        return i18n(errorKey);
    }
}

export default Validator