<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);
/**
 * @api {post} /ticket/get Get ticket
 * @apiVersion 4.11.0
 *
 * @apiName Get ticket
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path retrieves information about a ticket.
 *
 * @apiPermission user
 *
 * @apiParam {Number} ticketNumber The number of the ticket.
 *
 * @apiUse INVALID_TICKET
 * @apiUse INVALID_TOKEN
 * @apiUse NO_PERMISSION
 *
 * @apiSuccess {[Ticket](#api-Data_Structures-ObjectTicket)} data Information about the requested ticket.
 *
 */


class TicketGetController extends Controller {
    const PATH = '/get';
    const METHOD = 'POST';

    private $ticket;

    public function validations() {
        $session = Session::getInstance();
        return [
            'permission' => 'user',
            'requestData' => [
                'ticketNumber' => [
                    'validation' => DataValidator::validTicketNumber(),
                    'error' => ERRORS::NO_PERMISSION
                ]
            ]
        ];
    }

    public function handler() {
        $this->ticket = Ticket::getByTicketNumber(Controller::request('ticketNumber'));
        
        if ($this->shouldDenyPermission()) {
            throw new RequestException(ERRORS::NO_PERMISSION);
        } else {
            Response::respondSuccess($this->ticket->toArray());
        }
    }

    private function shouldDenyPermission() {
        $user = Controller::getLoggedUser();
        return !$user->canManageTicket($this->ticket);
    }
}
