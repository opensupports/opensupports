<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class TicketGetController extends Controller {
    const PATH = '/get';

    private $ticket;

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
        $this->ticket = Ticket::getByTicketNumber(Controller::request('ticketNumber'));

        if ($this->shouldDenyPermission()) {
            Response::respondError(ERRORS::NO_PERMISSION);
        } else {
            Response::respondSuccess($this->ticket->toArray());
        }
    }

    private function shouldDenyPermission() {
        $user = Controller::getLoggedUser();

        return (!Controller::isStaffLogged() && $this->ticket->author->id !== $user->id) ||
               (Controller::isStaffLogged() && $this->ticket->owner && $this->ticket->owner->id !== $user->id);
    }
}