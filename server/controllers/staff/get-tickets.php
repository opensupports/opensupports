<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /staff/get-tickets  Get own tickets.
 *
 * @apiName Get tickets
 *
 * @apiGroup staff
 *
 * @apiDescription This path give back the tickets of current staff member.
 *
 * @apiPermission Staff level 1
 *
 * @apiSuccess {Object} data
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