<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class CheckTicketController extends Controller {
    const PATH = '/check';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => [
                'ticketNumber' => [
                    'validation' => DataValidator::validTicketNumber(),
                    'error' => ERRORS::INVALID_TICKET
                ],
                'email' => [
                    'validation' => DataValidator::email(),
                    'error' => ERRORS::INVALID_EMAIL
                ],
                'captcha' => [
                    'validation' => DataValidator::captcha(),
                    'error' => ERRORS::INVALID_CAPTCHA
                ]
            ]
        ];
    }

    public function handler() {
        if (Controller::isUserSystemEnabled() || Controller::isStaffLogged()) {
            throw new Exception(ERRORS::NO_PERMISSION);
        }

        $email = Controller::request('email');
        $ticket = Ticket::getByTicketNumber(Controller::request('ticketNumber'));

        if($ticket->authorEmail === $email) {
            $session = Session::getInstance();
            $session->createTicketSession($ticket->ticketNumber);

            Response::respondSuccess([
                'token' => $session->getToken(),
                'ticketNumber' => $ticket->ticketNumber
            ]);
        } else {
            throw new Exception(ERRORS::NO_PERMISSION);
        }
    }
}