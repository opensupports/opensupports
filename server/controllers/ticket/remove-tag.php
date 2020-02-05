<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/remove-tag Remove tag
 * @apiVersion 4.6.1
 *
 * @apiName Remove tag
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path removes a tag from a ticket.
 *
 * @apiPermission staff1
 *
 * @apiParam {Number} ticketNumber The number of the ticket which the tag is going to be removed.
 * @apiParam {String} tagId The id of the tag to be removed.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TICKET
 * @apiUse INVALID_TAG
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class RemoveTagController extends Controller {
    const PATH = '/remove-tag';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'ticketNumber' => [
                    'validation' => DataValidator::validTicketNumber(),
                    'error' => ERRORS::INVALID_TICKET
                ],
                'tagId' => [
                    'validation' => DataValidator::dataStoreId('tag'),
                    'error' => ERRORS::INVALID_TAG
                ]
            ]
        ];
    }

    public function handler() {
        $tagId = Controller::request('tagId');
        $tag = Tag::getDataStore($tagId);
        $ticket = Ticket::getByTicketNumber(Controller::request('ticketNumber'));
        $user = Controller::getLoggedUser();

        if (!$user->canManageTicket($ticket)) throw new RequestException(ERRORS::NO_PERMISSION);

        if (!$ticket->sharedTagList->includesId($tagId)) throw new RequestException(ERRORS::INVALID_TAG);

        $ticket->sharedTagList->remove($tag);
        $ticket->store();

        Response::respondSuccess();
    }
}
