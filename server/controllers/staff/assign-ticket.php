<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class AssignStaffController extends Controller {
    const PATH = '/assign-ticket';
    const METHOD = 'POST';

    private $ticket;
    private $user;

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'ticketNumber' => [
                    'validation' => DataValidator::validTicketNumber(),
                    'error' => ERRORS::INVALID_TICKET
                ]
            ]
        ];
    }

    public function handler() {
        $ticketNumber = Controller::request('ticketNumber');
        $this->user = Controller::getLoggedUser();
        $this->ticket = Ticket::getByTicketNumber($ticketNumber);

        if($this->ticket->owner) {
            Response::respondError(ERRORS::TICKET_ALREADY_ASSIGNED);
            return;
        }

        if(!$this->ticketHasStaffDepartment())  {
            Response::respondError(ERRORS::INVALID_DEPARTMENT);
        } else {
            $this->user->sharedTicketList->add($this->ticket);
            $this->ticket->owner = $this->user;
            $this->ticket->unread = true;
            $event = Ticketevent::getEvent(Ticketevent::ASSIGN);
            $event->setProperties(array(
                'authorStaff' => Controller::getLoggedUser(),
                'date' => Date::getCurrentDate()
            ));
            $this->ticket->addEvent($event);

            $this->ticket->store();
            $this->user->store();

            Response::respondSuccess();
        }

    }

    public function ticketHasStaffDepartment() {
        $departmentMatch = false;

        foreach ($this->user->sharedDepartmentList as $department) {
            if($this->ticket->department->id === $department->id) {
                $departmentMatch = true;
            }
        }

        return $departmentMatch;
    }
}
