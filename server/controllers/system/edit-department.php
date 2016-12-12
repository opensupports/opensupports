<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);


class EditDepartmentController extends Controller {
    const PATH = '/edit-department';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'name' => [
                    'validation' => DataValidator::alnum(),
                    'error' => ERRORS::INVALID_NAME
                ],
                'departmentId' => [
                    'validation' => DataValidator::dataStoreId('department'),
                    'error' => ERRORS::INVALID_DEPARTMENT
                ]
            ]
        ];
    }

    public function handler() {
        $newname = Controller::request('name');
        $departmentId = Controller::request('departmentId');

        $departmentInstance = Department::getDataStore($departmentId);

        $departmentInstance->name = $newname ;

        $departmentInstance->store();

        Response::respondSuccess();

    }
}