<?php
use Respect\Validation\Validator as DataValidator;

class AddDepartmentController extends Controller {
    const PATH = '/add-department';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'name' => [
                    'validation' => DataValidator::alnum(),
                    'error' => ERRORS::INVALID_NAME
                ]
            ]
        ];
    }

    public function handler() {
        $name = Controller::request('name');
        
        $departmentInstance = new Department();
        
        $departmentInstance->setProperties([
            'name' => $name,
            
        ]);

        $departmentInstance->store();

        Response::respondSuccess();

    }
}