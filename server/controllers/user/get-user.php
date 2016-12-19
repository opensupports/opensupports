<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class GetUserByIdController extends Controller {
    const PATH = '/get-user';
    
    public function validations() {
        return [
            'permission' => 'staff_1',
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
        $staff = Controller::getLoggedUser();
        
        $tickets = new DataStoreList();
        
        foreach($user->sharedTicketList as $ticket) {
            if($staff->sharedDepartmentList->includesId($ticket->department->id)) {
                $tickets->add($ticket);
            }
        }

        Response::respondSuccess([
            'name' => $user->name,
            'email' => $user->email,
            'signupDate' => $user->signupDate,
            'tickets' => $tickets->toArray()
        ]);
    }
}