<?php
use Respect\Validation\Validator as DataValidator;

class SeenController extends Controller {
    const PATH = '/seen';
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
        $ticketnumber = Controller::request('ticketNumber');
        $user = Controller::getLoggedUser();
        $ticket = Ticket::getByTicketNumber($ticketnumber);
        
        if (Controller::isStaffLogged() && $ticket->owner && $ticket->owner->id === $user->id) {
            $ticket->unreadStaff = false;
            $ticket->store();
            Response::respondSuccess();
            return;
        }
        if (!Controller::isStaffLogged() && $ticket->author && $user->id === $ticket->author->id) {
            $ticket->unread  = false;
            $ticket->store();
            Response::respondSuccess();
            return;
        }
        Response::respondError(ERRORS::NO_PERMISSION);
        
    }
}