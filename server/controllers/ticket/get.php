<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/get give back information about a ticket.
 *
 * @apiName Get
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path give back information about a ticket.
 *
 * @apiPermission any
 *
 * @apiParam {number} ticketNumber The number of the ticket.
 *
 * @apiParam {string} csrf_token Token of the session.
 *
 * @apiError {String} message
 *
 * @apiSuccess {Object} data
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
                        'error' => $session->getToken() . ' != ' . Controller::request('csrf_token')
                    ]
                ]
            ];
        }
    }

    public function handler() {
        $this->ticket = Ticket::getByTicketNumber(Controller::request('ticketNumber'));

        if(Controller::isUserSystemEnabled() || Controller::isStaffLogged()) {
            if ($this->shouldDenyPermission()) {
                throw new Exception(ERRORS::NO_PERMISSION);
            } else {
                Response::respondSuccess($this->ticket->toArray());
            }
        } else {
            Response::respondSuccess($this->ticket->toArray());
        }
    }

    private function shouldDenyPermission() {
        $user = Controller::getLoggedUser();

        return (!Controller::isStaffLogged() && (Controller::isUserSystemEnabled() && $this->ticket->author->id !== $user->id)) ||
               (Controller::isStaffLogged() && (($this->ticket->owner && $this->ticket->owner->id !== $user->id) || !$user->sharedDepartmentList->includesId($this->ticket->department->id)));
    }
}