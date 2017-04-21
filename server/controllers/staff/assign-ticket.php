<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /staff/assign-ticket  Assign a ticket to a staff member.
 *
 * @apiName Assign ticket
 *
 * @apiGroup staff
 *
 * @apiDescription This path assigns a ticket to a staff member.
 *
 * @apiPermission Staff level 1
 *
 * @apiParam {Number} ticketNumber The number of the ticket to assign.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TICKET
 * @apiUse TICKET_ALREADY_ASSIGNED
 * @apiUse INVALID_DEPARTMENT
 * 
 * @apiSuccess {Object} data Empty object
 *
 */

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
