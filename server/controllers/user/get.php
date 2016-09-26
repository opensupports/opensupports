<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class GetUserController extends Controller {
    const PATH = '/get';

    public function validations() {
        return [
            'permission' => 'user',
            'requestData' => []
        ];
    }

    public function handler() {
        if (Controller::isStaffLogged()) {
            Response::respondError(ERRORS::INVALID_CREDENTIALS);
            return;
        }

        $user = Controller::getLoggedUser();
        $parsedTicketList = [];
        $ticketList = $user->sharedTicketList;

        foreach($ticketList as $ticket) {
            $parsedTicketList[] = $ticket->toArray();
        }

        Response::respondSuccess([
            'name' => $user->name,
            'email' => $user->email,
            'tickets' => $parsedTicketList
        ]);
    }
}