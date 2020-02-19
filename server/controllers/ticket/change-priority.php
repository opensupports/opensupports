<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /ticket/change-priority Change priority
 * @apiVersion 4.6.1
 *
 * @apiName Change priority
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path changes the priority of a ticket.
 *
 * @apiPermission staff1
 *
 * @apiParam {Number} ticketNumber The number of a ticket.
 * @apiParam {String} priority The new priority of the ticket.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TICKET
 * @apiUse INVALID_PRIORITY
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class ChangePriorityController extends Controller {
    const PATH = '/change-priority';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'ticketNumber' => [
                    'validation' => DataValidator::validTicketNumber(),
                    'error' => ERRORS::INVALID_TICKET
                ],
                'priority' => [
                    'validation' => DataValidator::in(['low', 'medium', 'high']),
                    'error' => ERRORS::INVALID_PRIORITY
                ]
            ]
        ];
    }

    public function handler() {
        $ticketNumber = Controller::request('ticketNumber');
        $priority = Controller::request('priority');
        $ticket = Ticket::getByTicketNumber($ticketNumber);
        $user = Controller::getLoggedUser();

        if(!$user->canManageTicket($ticket)) throw new RequestException(ERRORS::NO_PERMISSION);

        $ticket->priority = $priority;
        $ticket->unread = !$ticket->isAuthor($user);
        $event = Ticketevent::getEvent(Ticketevent::PRIORITY_CHANGED);
        $event->setProperties(array(
            'authorStaff' => Controller::getLoggedUser(),
            'content' => $ticket->priority,
            'date' => Date::getCurrentDate()
        ));
        $ticket->addEvent($event);
        $ticket->store();

        Log::createLog('PRIORITY_CHANGED', $ticket->ticketNumber);
        Response::respondSuccess();
    }
}
