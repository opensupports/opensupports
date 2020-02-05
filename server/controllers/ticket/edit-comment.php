<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/edit-comment Edit a comment
 * @apiVersion 4.6.1
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
 * @apiUse INVALID_TOKEN
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class EditCommentController extends Controller {
    const PATH = '/edit-comment';
    const METHOD = 'POST';

    public function validations() {
        if(Controller::isUserSystemEnabled()){
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
        } else {
            return [
                'permission' => 'any',
                'requestData' => [
                    'content' => [
                        'validation' => DataValidator::content(),
                        'error' => ERRORS::INVALID_CONTENT
                    ],
                    'ticketNumber' => [
                        'validation' => DataValidator::oneOf(DataValidator::validTicketNumber(),DataValidator::nullType()),
                        'error' => ERRORS::INVALID_TICKET
                    ],
                    'csrf_token' => [
                        'validation' => DataValidator::equals(Session::getInstance()->getToken()),
                        'error' => ERRORS::INVALID_TOKEN
                    ]
                ]
            ];
        }
    }

    public function handler() {
        $user = Controller::getLoggedUser();
        $newcontent = Controller::request('content', true);
        $ticketNumberLog = null;

        $ticketevent = Ticketevent::getTicketEvent(Controller::request('ticketEventId'));
        $ticket = Ticket::getByTicketNumber(Controller::request('ticketNumber'));

        if(Controller::isUserSystemEnabled() && !Controller::isStaffLogged() &&  ($user->id !== $ticketevent->authorUserId && $user->id !== $ticket->authorId ) ){
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        if(Controller::isStaffLogged()){
            if(!$ticketevent->isNull()){
                $ticket = $ticketevent->ticket;
            }

            if(!$user->canManageTicket($ticket)) {
                throw new RequestException(ERRORS::NO_PERMISSION);
            }
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
