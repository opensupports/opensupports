<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /staff/get Get staff
 * @apiVersion 4.6.1
 *
 * @apiName Get staff
 *
 * @apiGroup Staff
 *
 * @apiDescription This path retrieves information about a staff member.
 *
 * @apiPermission staff1
 *
 * @apiParam {Number} staffId The id of the staff member to be searched.
 *
 * @apiUse NO_PERMISSION
 *
 * @apiSuccess {Object} data Information about a staff member
 * @apiSuccess {String} data.name Name of the staff member
 * @apiSuccess {String} data.email Elmail of the staff member
 * @apiSuccess {String} data.profilePic Profile pic filename of staff member
 * @apiSuccess {Number} data.level Level of staff member
 * @apiSuccess {Boolean} data.staff Indicates that it is a staff (always true)
 * @apiSuccess {[Department](#api-Data_Structures-ObjectDepartment)[]} data.departments Array of departments that has assigned.
 * @apiSuccess {[Ticket](#api-Data_Structures-ObjectTicket)[]} data.tickets Array of tickets that has assigned.
 * @apiSuccess {Boolean} data.sendEmailOnNewTicket Indicates if this member receives a mail when a ticket is created.
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
                'name' => $department->name,
                'private' => $department->private
            ];
        }

        Response::respondSuccess([
            'name' => $user->name,
            'email' => $user->email,
            'profilePic' => $user->profilePic,
            'level' => $user->level,
            'staff' => true,
            'departments' => $parsedDepartmentList,
            'tickets' => $user->sharedTicketList->toArray(true),
            'sendEmailOnNewTicket' => $user->sendEmailOnNewTicket
        ]);
    }
}
