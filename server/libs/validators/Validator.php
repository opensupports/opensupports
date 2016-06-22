<?php
class ValidationException extends Exception {}

class Validator {
    public static function throwException($message = '') {
        throw new ValidationException($message);
    }

    protected $baseValidator;

    public function __construct(Validator $baseValidator = null) {
        $this->baseValidator = $baseValidator;
    }

    public function validate($value, $fullData = []) {
        if ($this->baseValidator) {
            $this->baseValidator->validate($value, $fullData);
        }
    }
}
