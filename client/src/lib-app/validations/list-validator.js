import Validator from 'lib-app/validations/validator';

class ListValidator extends Validator {

    validate(value, form) {
        if (!value.length) return this.getError('ERROR_LIST');
    }
}

export default ListValidator;