<?php
require_once 'validators/Validator.php';
require_once 'validators/EmailValidator.php';
require_once 'validators/PasswordValidator.php';

class ValidatorFactory {
    public static function getValidator($validatorName) {
        switch ($validatorName) {
            case 'email':
                return new EmailValidator();
            case 'password':
                return new PasswordValidator();
            default:
                return new Validator();
        }
    }
}