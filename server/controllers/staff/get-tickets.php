<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /staff/get-tickets Get tickets
 * @apiVersion 4.11.0
 *
 * @apiName Get tickets
 *
 * @apiGroup Staff
 *
 * @apiDescription This path retrieves the tickets assigned to the current staff member.
 *
 * @apiPermission staff1
 *
 * @apiParam {Number} page The page number.
 * @apiParam {bool} closed Include closed tickets in the response.
 * @apiParam {Number} departmentId The id of the department searched
 * 
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_PAGE
 * @apiUse INVALID_PAGE_SIZE
 *
 * @apiSuccess {Object} data Information about a tickets and quantity of pages.
 * @apiSuccess {[Ticket](#api-Data_Structures-ObjectTicket)[]} data.tickets Array of tickets assigned to the staff of the current page.
 * @apiSuccess {Number} data.page Number of current page.
 * @apiSuccess {Number} data.pages Quantity of pages.
 *
 */

class GetTicketStaffController extends Controller {
    const PATH = '/get-tickets';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'page' => [
                    'validation' => DataValidator::numeric(),
                    'error' => ERRORS::INVALID_PAGE
                ],
                'pageSize' => [
                  'validation' => DataValidator::oneOf(DataValidator::intVal()->between(5, 50),DataValidator::nullType()),
                  'error' => ERRORS::INVALID_PAGE_SIZE
                ]
            ]
        ];
    }

    public function handler() {
        $user = Controller::getLoggedUser();
        $closed = Controller::request('closed');
        $page = Controller::request('page');
        $departmentId = Controller::request('departmentId');
        $pageSize = Controller::request('pageSize') ? Controller::request('pageSize') : 10;
        $offset = ($page-1)*$pageSize;

        $condition = 'TRUE';
        $bindings = [];

        if($departmentId) {
            $condition .= ' AND department_id = ?';
            $bindings[] = $departmentId;
        }

        if(!$closed) {
            $condition .= ' AND closed = ?';
            $bindings[] = '0';
        }

        $countTotal = $user->withCondition($condition, $bindings)->countShared('ticket');

        $condition .= ' LIMIT ' . $pageSize . ' OFFSET ?';
        $bindings[] = $offset;

        $tickets = $user->withCondition($condition, $bindings)->sharedTicketList->toArray(true);

        Response::respondSuccess([
            'tickets' => $tickets,
            'page' => $page,
            'pages' => ceil($countTotal / $pageSize)
        ]);
    }
}
