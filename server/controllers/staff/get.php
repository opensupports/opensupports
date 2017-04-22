<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /staff/get  Retrieve information about a staff member.
 *
 * @apiName Get
 *
 * @apiGroup staff
 *
 * @apiDescription This path retrieves information about a staff member .
 *
 * @apiPermission Staff level 1
 *
 * @apiParam {Number} staffId The id of the staff member searched.
 * 
 * @apiUse NO_PERMISSION
 *
 * @apiSuccess {Object} data Information about a staff member
 * @apiSuccess {String} data.name Staff id
 * @apiSuccess {String} data.email Staff id
 * @apiSuccess {String} data.profilePic Staff id
 * @apiSuccess {Number} data.level Staff id
 * @apiSuccess {Boolean} data.staff Staff id
 * @apiSuccess {[Department](#api-Data_Structures-ObjectDepartment)[]} data.departments Array of departments that has assigned.
 * @apiSuccess {[Ticket](#api-Data_Structures-ObjectTicket)[]} data.tickets Array of tickets that has assigned.
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