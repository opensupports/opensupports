<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /staff/un-assign-ticket Un-assign ticket
 * @apiVersion 4.6.1
 *
 * @apiName Un-assign ticket
 *
 * @apiGroup Staff
 *
 * @apiDescription This path un-assigns a ticket to the current staff member.
 *
 * @apiPermission staff1
 *
 * @apiParam {Number} ticketNumber Ticket number to un-assign.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TICKET
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class UnAssignStaffController extends Controller {
    const PATH = '/un-assign-ticket';
    const METHOD = 'POST';

    private $user;

    public function __construct($user=null) {
        $this->user = $user;
    }

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
        $user = ($this->user? $this->user : Controller::getLoggedUser());
        $ticket = Ticket::getByTicketNumber($ticketNumber);
        $owner = $ticket->owner;

        if(!$user->canManageTicket($ticket)) {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        if($owner && ($ticket->isOwner($user) || $user->level > 2)) {
            if(!$ticket->isAuthor($owner)) {
                $owner->sharedTicketList->remove($ticket);
                $owner->store();
            }

            $ticket->owner = null;
            $ticket->unread = !$ticket->isAuthor($user);

            $event = Ticketevent::getEvent(Ticketevent::UN_ASSIGN);
            $event->setProperties(array(
                'authorStaff' => $user,
                'date' => Date::getCurrentDate(),
                'content' => $owner->name
            ));

            $ticket->addEvent($event);
            $ticket->store();
            Response::respondSuccess();
        } else {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }
    }
}
