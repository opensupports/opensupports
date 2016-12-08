<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class GetStaffController extends Controller {
    const PATH = '/get';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => []
        ];
    }

    public function handler() {
        $user = Controller::getLoggedUser();

        $userId = Controller::request('staffId');
        $userRow = Staff::getDataStore($userId);

        if($user->level == 3 && !$userRow->isNull()) {
            $user = $userRow;
        }

        $parsedDepartmentList = [];
        $departmentList = $user->sharedDepartmentList;

        foreach($departmentList as $department) {
            $parsedDepartmentList[] = [
                'id' => $department->id,
                'name' => $department->name
            ];
        }

        Response::respondSuccess([
            'name' => $user->name,
            'email' => $user->email,
            'profilePic' => $user->profilePic,
            'level' => $user->level,
            'staff' => true,
            'departments' => $parsedDepartmentList
        ]);
    }
}