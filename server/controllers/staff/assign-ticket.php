<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /staff/assign-ticket Assign ticket
 * @apiVersion 4.6.1
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
 * @apiParam {Number} staffId The id of the staff.
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
    private $staffToAssign;

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
        $staffId = Controller::request('staffId');
        $this->ticket = Ticket::getByTicketNumber($ticketNumber);
        $user = Controller::getLoggedUser();

        if($staffId) {
            $this->staffToAssign = Staff::getDataStore($staffId, 'id');

            if($this->staffToAssign->isNull()) {
                throw new RequestException(ERRORS::INVALID_STAFF);
            }

            if(!$this->staffToAssign->sharedDepartmentList->includesId($this->ticket->department->id)) {
                throw new RequestException(ERRORS::INVALID_DEPARTMENT);
            }
        } else {
            $this->staffToAssign = Controller::getLoggedUser();
        }

        if($this->ticket->owner) {
            throw new RequestException(ERRORS::TICKET_ALREADY_ASSIGNED);
        }

        if(!$user->canManageTicket($this->ticket)) {
            throw new RequestException(ERRORS::NO_PERMISSION);
        } else {
            $this->staffToAssign->sharedTicketList->add($this->ticket);
            $this->ticket->owner = $this->staffToAssign;
            $this->ticket->unread = !$this->ticket->isAuthor($this->staffToAssign);
            $event = Ticketevent::getEvent(Ticketevent::ASSIGN);
            $event->setProperties(array(
                'authorStaff' => Controller::getLoggedUser(),
                'date' => Date::getCurrentDate(),
                'content' => $this->staffToAssign->name,
            ));
            $this->ticket->addEvent($event);

            $this->ticket->store();
            $this->staffToAssign->store();

            Response::respondSuccess();
        }

    }

}
