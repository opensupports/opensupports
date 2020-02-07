<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /ticket/re-open Reopen ticket
 * @apiVersion 4.6.1
 *
 * @apiName Reopen ticket
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path reopens a closed ticket.
 *
 * @apiPermission user
 *
 * @apiParam {String} ticketNumber Number of the ticket to be reopened.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TICKET
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class ReOpenController extends Controller {
    const PATH = '/re-open';
    const METHOD = 'POST';

    private $ticket;

    public function validations() {
        return [
            'permission' => 'user',
            'requestData' => [
                'ticketNumber' => [
                    'validation' => DataValidator::validTicketNumber(),
                    'error' => ERRORS::INVALID_TICKET
                ]
            ]
        ];
    }

    public function handler() {
        $this->ticket = Ticket::getByTicketNumber(Controller::request('ticketNumber'));
        $user = Controller::getLoggedUser();

        if (!$user->canManageTicket($this->ticket)) throw new RequestException(ERRORS::NO_PERMISSION);

        $this->markAsUnread();
        $this->addReopenEvent();
        $this->ticket->closed = false;

        $this->ticket->store();

        Log::createLog('RE_OPEN', $this->ticket->ticketNumber);

        Response::respondSuccess();
    }

    private function markAsUnread() {
        if(Controller::isStaffLogged()) {
            $this->ticket->unread = true;
        } else {
            $this->ticket->unreadStaff = true;
        }
    }

    private function addReopenEvent() {
        $event = Ticketevent::getEvent(Ticketevent::RE_OPEN);
        $event->setProperties(array(
            'date' => Date::getCurrentDate()
        ));

        if(Controller::isStaffLogged()) {
            $event->authorStaff = Controller::getLoggedUser();
        } else {
            $event->authorUser = Controller::getLoggedUser();
        }

        $this->ticket->addEvent($event);
    }
}
