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

    }
}