<?php
use Respect\Validation\Validator as DataValidator;

class DeleteStaffController extends Controller {
    const PATH = '/delete';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => []
        ];
    }

    public function handler (){
        
    }
    
}