<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class DeleteDepartmentController extends Controller {
    const PATH = '/delete-department';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'departmentId' => [
                    'validation' => DataValidator::dataStoreId('department'),
                    'error' => ERRORS::INVALID_DEPARTMENT
                ],
            ]
        ];
    }

    public function handler() {

        $departmentId = Controller::request('departmentId');
        $departmentInstance = Department::getDataStore($departmentId);
        $departmentInstance->delete();
        Response::respondSuccess();
    }
}