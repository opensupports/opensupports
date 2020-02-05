<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/edit-title Edit title of a ticket
 * @apiVersion 4.6.1
 *
 * @apiName Edit title
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path edits the title of a ticket.
 *
 * @apiPermission user
 *
 * @apiParam {String} title The new title of the ticket.
 * @apiParam {Number} ticketNumber The number of the ticket.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TITLE
 * @apiUse INVALID_TOKEN
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class EditTitleController extends Controller {
    const PATH = '/edit-title';
    const METHOD = 'POST';

    public function validations() {
        if(Controller::isUserSystemEnabled()){
            return [
                'permission' => 'user',
                'requestData' => [
                    'title' => [
                        'validation' => DataValidator::notBlank()->length(1, 200),
                        'error' => ERRORS::INVALID_TITLE
                    ],
                    'ticketNumber' => [
                        'validation' => DataValidator::validTicketNumber(),
                        'error' => ERRORS::INVALID_TICKET
                    ]
                ]
            ];
        } else {
            return [
                'permission' => 'any',
                'requestData' => [
                    'title' => [
                        'validation' => DataValidator::notBlank()->length(1, 200),
                        'error' => ERRORS::INVALID_TITLE
                    ],
                    'ticketNumber' => [
                        'validation' => DataValidator::validTicketNumber(),
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
        $newtitle = Controller::request('title');
        $ticket = Ticket::getByTicketNumber(Controller::request('ticketNumber'));

        if(Controller::isUserSystemEnabled() && !$user->canManageTicket($ticket)) {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        $ticket->title = $newtitle;
        $ticket->editedTitle = true;
        $ticket->store();

        $ticketNumber = $ticket->ticketNumber;
        Log::createLog('EDIT_TITLE', $ticketNumber);

        Response::respondSuccess();
    }
}
