<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /staff/get  Get information about a staff member.
 *
 * @apiName Get
 *
 * @apiGroup staff
 *
 * @apiDescription This path give back information about a staff member .
 *
 * @apiPermission Staff level 1
 *
 * @apiParam {number} staffId The id of the staff member searched.
 * 
 * @apiError {String} message
 *
 * @apiSuccess {Object} data
 *
 */

class GetStaffController extends Controller {
    const PATH = '/get';
    const METHOD = 'POST';

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
            'departments' => $parsedDepartmentList,
            'tickets' => $user->sharedTicketList->toArray()
        ]);
    }
}