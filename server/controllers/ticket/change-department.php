<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class ChangeDepartmentController extends Controller {
    const PATH = '/change-department';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'ticketNumber' => [
                    'validation' => DataValidator::validTicketNumber(),
                    'error' => ERRORS::INVALID_TICKET
                ],
                'departmentId' => [
                    'validation' => DataValidator::dataStoreId('department'),
                    'error' => ERRORS::INVALID_DEPARTMENT
                ]
            ]
        ];
    }

    public function handler() {
        $ticketNumber = Controller::request('ticketNumber');
        $departmentId = Controller::request('departmentId');
        $ticket = Ticket::getByTicketNumber($ticketNumber);
        $department = Department::getDataStore($departmentId);
        $user = Controller::getLoggedUser();

        if($ticket->owner && $ticket->owner->id !== $user->id){
            Response::respondError(ERRORS::NO_PERMISSION);
            return;
        }

        $ticket->department = $department;
        $ticket->store();
        Response::respondSuccess();
    }
}