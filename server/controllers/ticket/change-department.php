<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class ChangeDepartmentController extends Controller {
    const PATH = '/change-department';
    const METHOD = 'POST';

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

        $event = Ticketevent::getEvent(Ticketevent::DEPARTMENT_CHANGED);
        $event->setProperties(array(
            'authorStaff' => Controller::getLoggedUser(),
            'content' => $department->name,
            'date' => Date::getCurrentDate()
        ));
        $ticket->addEvent($event);
        $ticket->department = $department;
        $ticket->unread = true;
        $ticket->store();

        Log::createLog('DEPARTMENT_CHANGED', $ticket->ticketNumber);

        Response::respondSuccess();
    }
}