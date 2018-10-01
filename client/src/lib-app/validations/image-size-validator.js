import _ from 'lodash';

import Validator from 'lib-app/validations/validator';
import SessionStore from 'lib-app/session-store';
import Base64ImageParser from 'lib-core/base64-image-parser';

class ImageSizeValidator extends Validator {
    constructor(errorKey = 'ERROR_IMAGE_SIZE', validator = null) {
        super(validator);

        this.maxSize = 1;
        this.errorKey = errorKey;
    }

    validate(value = '', form = {}) {
        let images = Base64ImageParser.getImagesSrc(value).map(Base64ImageParser.dataURLtoFile);

        if(_.some(images, f => f.size > 1048576 * SessionStore.getItem('max-size'))) {
            return this.getError(this.errorKey, {size: SessionStore.getItem('max-size')});
        }
    }
}

export default ImageSizeValidator;
