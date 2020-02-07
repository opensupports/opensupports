<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/delete Delete a ticket
 * @apiVersion 4.6.1
 *
 * @apiName Delete ticket
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path deletes a ticket.
 *
 * @apiPermission user
 *
 * @apiParam {Number} ticketNumber The number of the ticket to delete.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TICKET
 *
 * @apiSuccess {Object} data Empty object
 *ulp d
 */

class DeleteController extends Controller {
    const PATH = '/delete';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'user',
            'requestData' => [
                'ticketNumber' => [
                    'validation' => DataValidator::validTicketNumber(),
                    'error' => ERRORS::INVALID_TICKET
                ]
            ]
        ];
    }

    public function handler() {
        $user = Controller::getLoggedUser();
        $ticket = Ticket::getByTicketNumber(Controller::request('ticketNumber'));
        $ticketAuthor = $ticket->authorToArray();

        if($ticket->owner) {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        if(Controller::isStaffLogged() && $user->level < 3 && ($user->email !== $ticketAuthor['email'])) {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        if(!Controller::isStaffLogged() && ($user->email !== $ticketAuthor['email'] || $ticketAuthor['staff'])) {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        $ticket->delete();

        Response::respondSuccess();
    }
}
