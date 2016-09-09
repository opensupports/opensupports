<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class TicketGetController extends Controller {
    const PATH = '/get';

    public function validations() {
        return [
            'permission' => 'user',
            'requestData' => [
                'ticketNumber' => [
                    'validation' => DataValidator::length(6),
                    'error' => ERRORS::INVALID_TICKET
                ]
            ]
        ];
    }

    public function handler() {
        $ticketNumber = Controller::request('ticketNumber');

        $ticket = Ticket::getByTicketNumber($ticketNumber);

        if ($ticket->isNull() || $ticket->author->id != Controller::getLoggedUser()->id) {
            Response::respondError(ERRORS::INVALID_TICKET);
        } else {
            Response::respondSuccess($ticket->toArray());
        }
    }
}