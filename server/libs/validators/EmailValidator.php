<?php
require_once 'Validator.php';

class EmailValidator extends Validator {

    public function validate($value, $fullData) {
        parent::validate($value, $fullData);

        if (strpos($value, '@') === false) {
            Validator::throwException();
        }
    }
}
