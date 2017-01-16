<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class TicketGetController extends Controller {
    const PATH = '/get';

    private $ticket;

    public function validations() {
        $validations = [
            'permission' => 'user',
            'requestData' => [
                'ticketNumber' => [
                    'validation' => DataValidator::validTicketNumber(),
                    'error' => ERRORS::INVALID_TICKET
                ]
            ]
        ];

        if(!Controller::isUserSystemEnabled() && !Controller::isStaffLogged()) {
            $validations['permission'] = 'any';
            $validations['requestData']['email'] = [
                'validation' => DataValidator::email(),
                'error' => ERRORS::INVALID_EMAIL
            ];
            $validations['requestData']['captcha'] = [
                'validation' => DataValidator::captcha(),
                'error' => ERRORS::INVALID_CAPTCHA
            ];
        }

        return $validations;
    }

    public function handler() {
        $email = Controller::request('email');

        $this->ticket = Ticket::getByTicketNumber(Controller::request('ticketNumber'));

        if(!Controller::isUserSystemEnabled() && !Controller::isStaffLogged()) {
            if($this->ticket->authorEmail === $email) {
                Response::respondSuccess($this->ticket->toArray());
                return;
            } else {
                throw new Exception(ERRORS::NO_PERMISSION);
            }
        }

        if ($this->shouldDenyPermission()) {
            throw new Exception(ERRORS::NO_PERMISSION);
        } else {
            Response::respondSuccess($this->ticket->toArray());
        }
    }

    private function shouldDenyPermission() {
        $user = Controller::getLoggedUser();

        return (!Controller::isStaffLogged() && (Controller::isUserSystemEnabled() && $this->ticket->author->id !== $user->id)) ||
               (Controller::isStaffLogged() && $this->ticket->owner && $this->ticket->owner->id !== $user->id);
    }
}