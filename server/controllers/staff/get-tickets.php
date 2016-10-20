<?php
use Respect\Validation\Validator as DataValidator;

class GetTicketStaffController extends Controller {
    const PATH = '/get-tickets';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => []
        ];
    }

    public function handler() {
        $user = Controller::getLoggedUser();
        Response::respondSuccess($user->sharedTicketList->toArray());
    }
}