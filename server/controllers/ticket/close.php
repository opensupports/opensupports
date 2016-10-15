<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class CloseController extends Controller {
    const PATH = '/close';

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
        $ticketNumber = Controller::request('ticketNumber');
        $ticket = Ticket::getByTicketNumber($ticketNumber);
        $user = Controller::getLoggedUser();

        if(!Controller::isStaffLogged() && $ticket->author->id !== $user->id){
            Response::respondError(ERRORS::NO_PERMISSION);
            return;
        }

        if(Controller::isStaffLogged() && $ticket->owner && $ticket->owner->id !== $user->id){
            Response::respondError(ERRORS::NO_PERMISSION);
            return;
        }

        $ticket->closed = true;
        $ticket->store();
        Response::respondSuccess();
    }
}