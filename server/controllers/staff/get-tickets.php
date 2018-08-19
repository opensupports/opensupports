<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /staff/get-tickets Get tickets
 * @apiVersion 4.2.0
 *
 * @apiName Get tickets
 *
 * @apiGroup Staff
 *
 * @apiDescription This path retrieves the tickets assigned to the current staff member.
 *
 * @apiPermission staff1
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