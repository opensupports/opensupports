<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class GetUserController extends Controller {
    const PATH = '/get-user';
    
    public function validations() {
        return [
            'permission' => 'staff_2',
            'requestData' => [
                'userId' => [
                    'validation' => DataValidator::dataStoreId('user'),
                    'error' => ERRORS::INVALID_USER
                ]
            ]
        ];
    }

    public function handler() {
        $userId = Controller::request('userId');
        $user = User::getDataStore($userId);

        Response::respondSuccess([
            'name' => $user->name,
            'email' => $user->email,
            'signupDate' => $user->signupDate,
            'tickets' => $user->sharedTicketList->toArray()
        ]);
    }
}