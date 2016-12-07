<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class DeleteStaffController extends Controller {
    const PATH = '/delete';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                
            ]
        ];
    }

    public function handler() {
        $staffId = Controller::request('userId');
        
        
        
        $staff = Staff::getDataStore($staffId);
        $staff->delete();
        Response::respondSuccess();
    }
    
}