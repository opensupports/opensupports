<?php
use Respect\Validation\Validator as DataValidator;


class GetAllStaffController extends Controller {
    const PATH ='/get-all';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => []
        ];
    }


    public function handler() {
        $staffs = Staff::getAll();
        $staffArray = [];

        foreach($staffs as $staff) {
            $staffArray[] = $staff->toArray();
        }

        Response::respondSuccess($staffArray);
    
    }
}