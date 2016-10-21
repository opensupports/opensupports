<?php
use Respect\Validation\Validator as DataValidator;

class ChangePriorityController extends Controller {
    const PATH = '/change-priority';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'ticketNumber' => [
                    'validation' => DataValidator::validTicketNumber(),
                    'error' => ERRORS::INVALID_TICKET
                ],
                'priority' => [
                    'validation' => DataValidator::in(['low', 'medium', 'high']),
                    'error' => ERRORS::INVALID_PRIORITY
                ]
            ]
        ];
    }

    public function handler() {
        $ticketNumber = Controller::request('ticketNumber');
        $priority = Controller::request('priority');
        $ticket = Ticket::getByTicketNumber($ticketNumber);
        $user = Controller::getLoggedUser();

        if($ticket->owner && $user->id === $ticket->owner->id) {
            $ticket->priority = $priority;
            $ticket->unread = true;
            $ticket->store();
            Response::respondSuccess();
        } else {
            Response::respondError(ERRORS::NO_PERMISSION);
        }

    }
}


