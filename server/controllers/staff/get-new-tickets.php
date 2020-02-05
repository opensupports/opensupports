<?php
use RedBeanPHP\Facade as RedBean;
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /staff/get-new-tickets Get new tickets
 * @apiVersion 4.6.1
 *
 * @apiName Get new tickets
 *
 * @apiGroup Staff
 *
 * @apiDescription This path retrieves the new tickets of the departments the staff has assigned.
 *
 * @apiPermission staff1
 *
 * @apiParam {Number} page The page number.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_PAGE
 *
 * @apiSuccess {Object} data Information about a tickets and quantity of pages.
 * @apiSuccess {[Ticket](#api-Data_Structures-ObjectTicket)[]} data.tickets Array of new tickets of the current page.
 * @apiSuccess {Number} data.page Number of current page.
 * @apiSuccess {Number} data.pages Quantity of pages.
 *
 */

class GetNewTicketsStaffController extends Controller {
    const PATH = '/get-new-tickets';
    const METHOD = 'POST';

    public function validations() {
        return[
            'permission' => 'staff_1',
            'requestData' => [
                'page' => [
                    'validation' => DataValidator::numeric(),
                    'error' => ERRORS::INVALID_PAGE
                ]
            ]
        ];
    }
    public function handler() {
        $page = Controller::request('page');
        $departmentId = Controller::request('departmentId');

        if (Ticket::isTableEmpty()) {
            Response::respondSuccess([
                'tickets' => [],
                'page' => $page,
                'pages' => 0
            ]);
            return;
        }

        $user = Controller::getLoggedUser();

        $query = ' (';
        foreach ($user->sharedDepartmentList as $department) {
            $query .= 'department_id=' . $department->id . ' OR ';
        }

        $ownerExists = RedBean::exec('SHOW COLUMNS FROM ticket LIKE \'owner_id\'');

        if($ownerExists != 0) {
            $query .= 'FALSE) AND closed = 0 AND owner_id IS NULL';
        } else {
            $query .= 'FALSE) AND closed = 0';
        }

        if($departmentId) {
            $query .= ' AND department_id=' . $departmentId;
        }

        $countTotal = Ticket::count($query);

        $query .= ' ORDER BY unread_staff DESC';
        $query .= ' LIMIT 10 OFFSET ' . ($page-1)*10;

        $ticketList = Ticket::find($query);

        Response::respondSuccess([
            'tickets' => $ticketList->toArray(true),
            'page' => $page,
            'pages' => ceil($countTotal / 10)
        ]);
    }
}
