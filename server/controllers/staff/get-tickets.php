<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /staff/get-tickets Get tickets
 * @apiVersion 4.3.2
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
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_PAGE
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
                ]
            ]
        ];
    }

    public function handler() {
        $user = Controller::getLoggedUser();
        $closed = Controller::request('closed');
        $page = Controller::request('page');
        $offset = ($page-1)*10;

        if ($closed) {
            $tickets = $user->withCondition(' TRUE LIMIT 10 OFFSET ?', [$offset])->sharedTicketList->toArray(true);
            $countTotal = $user->countShared('ticket');
        } else {
            $tickets = $user->withCondition(' closed = ? LIMIT 10 OFFSET ?', ['0', $offset])->sharedTicketList->toArray(true);
            $countTotal = $user->withCondition(' closed = ?', ['0'])->countShared('ticket');
        }

        Response::respondSuccess([
            'tickets' => $tickets,
            'page' => $page,
            'pages' => ceil($countTotal / 10)
        ]);
    }
}
