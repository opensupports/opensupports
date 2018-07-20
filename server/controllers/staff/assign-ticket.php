<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /staff/assign-ticket Assign ticket
 * @apiVersion 4.1.0
 *
 * @apiName Assign ticket
 *
 * @apiGroup Staff
 *
 * @apiDescription This path assigns a ticket to a staff member.
 *
 * @apiPermission staff1
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
            throw new Exception(ERRORS::TICKET_ALREADY_ASSIGNED);
            return;
        }

        if(!$this->ticketHasStaffDepartment())  {
            throw new Exception(ERRORS::INVALID_DEPARTMENT);
        } else {
            $this->user->sharedTicketList->add($this->ticket);
            $this->ticket->owner = $this->user;
            $this->ticket->unread = !$this->ticket->isAuthor($this->user);
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
