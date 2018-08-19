<?php
use RedBeanPHP\Facade as RedBean;
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /staff/get-new-tickets Get new tickets
 * @apiVersion 4.2.0
 *
 * @apiName Get new tickets
 *
 * @apiGroup Staff
 *
 * @apiDescription This path retrieves the new tickets of the departments the staff has assigned.
 *
 * @apiPermission staff1
 *
 * @apiUse NO_PERMISSION
 *
 * @apiSuccess {[Ticket](#api-Data_Structures-ObjectTicket)[]} data Array of new tickets.
 *
 */

class GetNewTicketsStaffController extends Controller {
    const PATH = '/get-new-tickets';
    const METHOD = 'POST';

    public function validations() {
        return[
            'permission' => 'staff_1',
            'requestData' => []
        ];
    }
    public function handler() {
        if (Ticket::isTableEmpty()) {
            Response::respondSuccess([]);
            return;
        }

        $user = Controller::getLoggedUser();
        $query = ' (';
        foreach ($user->sharedDepartmentList as $department) {
            $query .= 'department_id=' . $department->id . ' OR ';
        }

        $ownerExists = RedBean::exec('SHOW COLUMNS FROM ticket LIKE \'owner_id\'');

        if($ownerExists != 0) {
            $query .= 'FALSE) AND owner_id IS NULL';
        } else {
            $query .= 'FALSE)';
        }

        $ticketList = Ticket::find($query);

        Response::respondSuccess($ticketList->toArray());
    }
}
