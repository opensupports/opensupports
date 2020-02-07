<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /staff/get-all  Get all staffs
 * @apiVersion 4.6.1
 *
 * @apiName Get all staffs
 *
 * @apiGroup Staff
 *
 * @apiDescription This path retrieves information about all the staff member.
 *
 * @apiPermission staff1
 *
 * @apiUse NO_PERMISSION
 *
 * @apiSuccess {[Staff](#api-Data_Structures-ObjectStaff)[]} data Array of staff members.
 *
 */

class GetAllStaffController extends Controller {
    const PATH ='/get-all';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => []
        ];
    }


    public function handler() {
        $staffs = Staff::getAll();
        $staffArray = [];

        foreach($staffs as $staff) {
            $assignedTickets = 0;
            $closedTickets = 0;

            foreach ($staff->sharedTicketList as $ticket) {
                if($ticket->closed) $closedTickets++;
                else $assignedTickets++;
            }

            $staffArray[] = [
                'id' => $staff->id,
                'name' => $staff->name,
                'email' => $staff->email,
                'profilePic' => $staff->profilePic,
                'level' => $staff->level,
                'departments' => $staff->sharedDepartmentList->toArray(),
                'assignedTickets' => $assignedTickets,
                'closedTickets' => $closedTickets,
                'lastLogin' => $staff->lastLogin
            ];
        }

        Response::respondSuccess($staffArray);

    }
}
