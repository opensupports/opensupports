<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/edit-comment Edit a comment
 * @apiVersion 4.11.0
 *
 * @apiName Edit comment
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path edits a comment.
 *
 * @apiPermission user
 *
 * @apiParam {String} content The new content of the comment.
 * @apiParam {Number} ticketEventId The id of the ticket event.
 * @apiParam {Number} ticketNumber The number of the ticket.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_CONTENT
 * @apiUse INVALID_TICKET
 * @apiUse INVALID_TICKET_EVENT
 * @apiUse TICKET_CONTENT_CANNOT_BE_EDITED
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class EditCommentController extends Controller {
    const PATH = '/edit-comment';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'user',
            'requestData' => [
                'content' => [
                    'validation' => DataValidator::content(),
                    'error' => ERRORS::INVALID_CONTENT
                ],
                'ticketNumber' => [
                    'validation' => DataValidator::oneOf(DataValidator::validTicketNumber(),DataValidator::nullType()),
                    'error' => ERRORS::INVALID_TICKET
                ]
            ]
        ];
    }

    public function handler() {
        $user = Controller::getLoggedUser();
        $newcontent = Controller::request('content', true);
        $ticketNumberLog = null;
        $ticketevent = Ticketevent::getTicketEvent(Controller::request('ticketEventId'));

        if(!$ticketevent->isNull()) {
            $ticket = Ticket::getDataStore($ticketevent->ticketId);
        } else {
            $ticket = Ticket::getByTicketNumber(Controller::request('ticketNumber'));
        }

        if(!Controller::isStaffLogged() &&  $user->id !== $ticketevent->authorUserId && $user->id !== $ticket->authorId) {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        if (!$ticketevent->isNull()) {
            if($user->id !== $ticketevent->authorUserId) {
                throw new RequestException(ERRORS::NO_PERMISSION);
            }
        } else if ($user->id !== $ticket->authorId) {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        if(Controller::isStaffLogged() && !$user->canManageTicket($ticket)) {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        if(!$ticketevent->isNull()) {
            if($ticketevent->type !== "COMMENT" || $ticket->closed || $ticket->getLatestEventOfType("COMMENT")['id'] !== $ticketevent->id) {
                throw new RequestException(ERRORS::INVALID_TICKET_EVENT);
            }
        } else if(sizeof($ticket->getEventsOfType("COMMENT"))) {
            throw new RequestException(ERRORS::TICKET_CONTENT_CANNOT_BE_EDITED);
        }

        if(!$ticketevent->isNull()){
            $ticketNumber = Ticket::getTicket($ticketevent->ticketId)->ticketNumber;

            $ticketevent->content = $newcontent;
            $ticketevent->editedContent = true;
            $ticketevent->store();
        } else {
            $ticketNumber = $ticket->ticketNumber;

            $ticket->content = $newcontent;
            $ticket->editedContent = true;
            $ticket->store();
        }

        Log::createLog('EDIT_COMMENT', $ticketNumber);

        Response::respondSuccess();
    }
}
