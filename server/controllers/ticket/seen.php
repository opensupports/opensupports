<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /ticket/seen See ticket
 * @apiVersion 4.6.1
 *
 * @apiName See ticket
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path sets "unread" value to false, so it does not appear highlighted.
 *
 * @apiPermission user
 *
 * @apiParam {Number} ticketNumber Number of the ticket.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TICKET
 *
 * @apiSuccess {Object} data Empty object
 *
 */


class SeenController extends Controller {
    const PATH = '/seen';
    const METHOD = 'POST';

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
        $ticketnumber = Controller::request('ticketNumber');
        $user = Controller::getLoggedUser();
        $ticket = Ticket::getByTicketNumber($ticketnumber);

        if(!$user->canManageTicket($ticket) && !$ticket->isAuthor($user)) {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        if ($ticket->isOwner($user)) {
            $ticket->unreadStaff = false;
        }
        if ($ticket->isAuthor($user)) {
            $ticket->unread = false;
        }

        $ticket->store();

        Response::respondSuccess();
    }
}
