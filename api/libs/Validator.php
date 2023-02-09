<?php
include_once 'libs/RequestException.php';

use Respect\Validation\Validator as DataValidator;

class ValidationException extends RequestException {}

class Validator {

    public function validate($config) {
        $this->validatePermissions($config['permission']);
        $this->validateAllRequestData($config['requestData']);
    }

    private function validatePermissions($permission) {
        $permissions = [
            'any' => true,
            'user' => Controller::isUserLogged(),
            'staff_1' => Controller::isStaffLogged(1),
            'staff_2' => Controller::isStaffLogged(2),
            'staff_3' => Controller::isStaffLogged(3)
        ];

        if (!$permissions[$permission]) {
            throw new ValidationException(ERRORS::NO_PERMISSION);
        }
    }

    private function validateAllRequestData($requestDataValidations) {
        foreach ($requestDataValidations as $requestDataKey => $requestDataValidationConfig) {
            $requestDataValue = Controller::request($requestDataKey);
            $requestDataValidator = $requestDataValidationConfig['validation'];
            $requestDataValidationErrorMessage = $requestDataValidationConfig['error'];

            $this->validateData($requestDataValue, $requestDataValidator, $requestDataValidationErrorMessage);
        }
    }

    private function validateData($value, DataValidator $dataValidator, $error) {
        if (!$dataValidator->validate($value)) {
            throw new ValidationException($error);
        }
    }

}
