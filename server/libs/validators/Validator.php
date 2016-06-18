<?php
class ValidationException extends Exception {}

class Validator {
    public static function throwException($message = '') {
        throw new ValidationException($message);
    }

    public function validate($value) {
        if (!$value) {
            throw new ValidationException();
        }
    }
}
