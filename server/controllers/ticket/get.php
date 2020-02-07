<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);
/**
 * @api {post} /ticket/get Get ticket
 * @apiVersion 4.6.1
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

        if (Controller::isUserSystemEnabled() || Controller::isStaffLogged()) {
            return [
                'permission' => 'user',
                'requestData' => [
                    'ticketNumber' => [
                        'validation' => DataValidator::validTicketNumber(),
                        'error' => ERRORS::INVALID_TICKET
                    ]
                ]
            ];
        } else {
            return [
                'permission' => 'any',
                'requestData' => [
                    'ticketNumber' => [
                        'validation' => DataValidator::equals($session->getTicketNumber()),
                        'error' => ERRORS::INVALID_TICKET
                    ],
                    'csrf_token' => [
                        'validation' => DataValidator::equals($session->getToken()),
                        'error' => ERRORS::INVALID_TOKEN
                    ]
                ]
            ];
        }
    }

    public function handler() {
        $this->ticket = Ticket::getByTicketNumber(Controller::request('ticketNumber'));

        if(Controller::isUserSystemEnabled() || Controller::isStaffLogged()) {
            if ($this->shouldDenyPermission()) {
                throw new RequestException(ERRORS::NO_PERMISSION);
            } else {
                Response::respondSuccess($this->ticket->toArray());
            }
        } else {
            Response::respondSuccess($this->ticket->toArray());
        }
    }

    private function shouldDenyPermission() {
        $user = Controller::getLoggedUser();

        return (!Controller::isStaffLogged() && (Controller::isUserSystemEnabled() && !$user->canManageTicket($this->ticket))) ||
               (Controller::isStaffLogged() && !$user->canManageTicket($this->ticket));
    }
}
