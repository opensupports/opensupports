<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class DeleteDepartmentController extends Controller {
    const PATH = '/delete-department';
    
    private $departmentId;
    private $transferDepartmentId;

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'departmentId' => [
                    'validation' => DataValidator::dataStoreId('department'),
                    'error' => ERRORS::INVALID_DEPARTMENT
                ],
                'transferDepartmentId' => [
                    'validation' => DataValidator::dataStoreId('department'),
                    'error' => ERRORS::INVALID_DEPARTMENT
                ]
            ]
        ];
    }

    public function handler() {
        $this->departmentId = Controller::request('departmentId');
        $this->transferDepartmentId = Controller::request('transferDepartmentId');

        if ($this->departmentId === $this->transferDepartmentId) {
            Response::respondError(ERRORS::SAME_DEPARTMENT);
            return;
        }

        $this->transferDepartmentTickets();
        $departmentInstance = Department::getDataStore($this->departmentId);
        $departmentInstance->delete();

        Log::createLog('DELETE_DEPARTMENT', $departmentInstance->name);

        Response::respondSuccess();
    }
    
    public function transferDepartmentTickets() {
        $tickets = Ticket::find('department_id = ?', [$this->departmentId]);
        $newDepartment = Department::getDataStore($this->transferDepartmentId);;

        foreach($tickets as $ticket) {
            $staffOwner = $ticket->owner;

            if($staffOwner) {
                $hasDepartment = false;

                foreach($staffOwner->sharedDepartmentList as $department) {
                    if($department->id === $newDepartment->id) {
                        $hasDepartment = true;
                    }
                }

                if(!$hasDepartment) {
                    $staffOwner->sharedTicketList->remove($ticket);
                    $staffOwner->store();

                    $ticket->owner = null;
                    $ticket->unread = true;

                    $event = Ticketevent::getEvent(Ticketevent::UN_ASSIGN);
                    $event->setProperties(array(
                        'authorStaff' => $staffOwner,
                        'date' => Date::getCurrentDate()
                    ));

                    $ticket->addEvent($event);
                }
            }

            $ticket->department = $newDepartment;
            $ticket->store();
        }
    }
}