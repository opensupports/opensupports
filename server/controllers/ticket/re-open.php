<?php
use Respect\Validation\Validator as DataValidator;

class ReOpenController extends Controller {
    const PATH = '/re-open';

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
        if(Controller::isStaffLogged()) {
            $ticket->unread = true;
        } else {
            $ticket->unreadStaff = true;
        }
        $ticket->closed = false;
        $ticket->store();
        Response::respondSuccess();
    }
}