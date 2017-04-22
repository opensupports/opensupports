<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /user/get Retrieve the information of yourself.
 *
 * @apiName Get
 *
 * @apiGroup User
 *
 * @apiDescription This path retrieve the information of a user.
 *
 * @apiPermission User
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_CREDENTIALS
 *
 * @apiSuccess {Object} data Information about a user
 * @apiSuccess {String} data.name Name of the user 
 * @apiSuccess {String} data.email Email of the user
 * @apiSuccess {Boolean} data.verified Indicates if the user is verified
 * @apiSuccess {Object} data Information about a user
 * @apiSuccess {[Ticket](#api-Data_Structures-ObjectTicket)[]} data.tickets Array of tickets of the user
 *
 */

class GetUserController extends Controller {
    const PATH = '/get';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'user',
            'requestData' => []
        ];
    }

    public function handler() {
        if (Controller::isStaffLogged()) {
            Response::respondError(ERRORS::INVALID_CREDENTIALS);
            return;
        }

        $user = Controller::getLoggedUser();
        $parsedTicketList = [];
        $ticketList = $user->sharedTicketList;

        foreach($ticketList as $ticket) {
            $parsedTicketList[] = $ticket->toArray();
        }

        Response::respondSuccess([
            'name' => $user->name,
            'email' => $user->email,
            'verified' => !$user->verificationToken,
            'tickets' => $parsedTicketList
        ]);
    }
}