<?php
use Respect\Validation\Validator as DataValidator;

class SeenController extends Controller {
    const PATH = '/seen';

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
        
        if (Controller::isStaffLogged() && $ticket->owner_id === $user->id) {
            $ticket->unreadStaff = false;
            $ticket->store();
            Response::respondSuccess();
            return;
        }
        if (!Controller::isStaffLogged() && $user->id === $ticket->author_id) {
            $ticket->unread  = false;
            $ticket->store();
            Response::respondSuccess();
            return;
        }
        Response::respondError(ERRORS::NO_PERMISSION);
        
    }
}