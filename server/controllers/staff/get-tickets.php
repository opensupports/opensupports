<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /staff/get-tickets Retrieve own tickets.
 *
 * @apiName Get tickets
 *
 * @apiGroup staff
 *
 * @apiDescription This path retrieves the tickets of current staff member.
 *
 * @apiPermission Staff level 1
 *
 * @apiUse NO_PERMISSION
 * 
 * @apiSuccess {[Ticket](#api-Data_Structures-ObjectTicket)[]} data Array of tickets assigned to the staff
 *
 */

class GetTicketStaffController extends Controller {
    const PATH = '/get-tickets';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => []
        ];
    }

    public function handler() {
        $user = Controller::getLoggedUser();
        Response::respondSuccess($user->sharedTicketList->toArray());
    }
}