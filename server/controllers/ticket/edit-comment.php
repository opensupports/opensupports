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
        $ticketEvent = Ticketevent::getTicketEvent(Controller::request('ticketEventId'));
        $commentAuthor = null;

        if(!$ticketEvent->isNull()) {
            $ticket = Ticket::getDataStore($ticketEvent->ticketId);
            $commentAuthor = $ticketEvent->toArray()["author"];
        } else {
            $ticket = Ticket::getByTicketNumber(Controller::request('ticketNumber'));
            $commentAuthor = $ticket->toArray()["author"];
        }

        if((!!$user->toArray()["isStaff"] !== !!$commentAuthor["staff"]) || ($user->id !== $commentAuthor["id"])) {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        if(Controller::isStaffLogged() && !$user->canManageTicket($ticket)) {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        if(!$ticketEvent->isNull()) {
            if($ticketEvent->type !== "COMMENT" || $ticket->closed || $ticket->getLatestEventOfType("COMMENT")['id'] !== $ticketEvent->id) {
                throw new RequestException(ERRORS::INVALID_TICKET_EVENT);
            }
        } else if(sizeof($ticket->getEventsOfType("COMMENT"))) {
            throw new RequestException(ERRORS::TICKET_CONTENT_CANNOT_BE_EDITED);
        }

        if(!$ticketEvent->isNull()){
            $ticketNumber = Ticket::getTicket($ticketEvent->ticketId)->ticketNumber;

            $ticketEvent->content = $newcontent;
            $ticketEvent->editedContent = true;
            $ticketEvent->store();
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
