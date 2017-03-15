<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class InitAdminController extends Controller {
    const PATH = '/init-admin';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => [
                'name' => [
                    'validation' => DataValidator::length(2, 55),
                    'error' => ERRORS::INVALID_NAME
                ],
                'email' => [
                    'validation' => DataValidator::email(),
                    'error' => ERRORS::INVALID_EMAIL
                ],
                'password' => [
                    'validation' => DataValidator::length(5, 200),
                    'error' => ERRORS::INVALID_PASSWORD
                ],
            ]
        ];
    }

    public function handler() {
        if(!Staff::isTableEmpty()) {
            throw new Exception(ERRORS::INIT_SETTINGS_DONE);
        }

        $staff = new Staff();
        $staff->setProperties([
            'name' => Controller::request('name'),
            'email' => Controller::request('email'),
            'password' => Controller::request('password'),
            'profilePic' => '',
            'level' => 3,
            'sharedDepartmentList' => Department::getAll(),
            'sharedTicketList' => []
        ]);
        
        foreach(Department::getAll() as $department) {
            $department->owners++;
            $department->store();
        }
        
        $staff->store();

        Response::respondSuccess();
    }
}