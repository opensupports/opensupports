<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/add-tag Add tag
 * @apiVersion 4.6.1
 *
 * @apiName Add tag
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path attaches a new tag to a ticket.
 *
 * @apiPermission staff1
 *
 * @apiParam {Number} ticketNumber The number of the ticket which the tag is going to be attached.
 * @apiParam {String} tagId The id of the tag to attach.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TICKET
 * @apiUse INVALID_TAG
 * @apiUse TAG_EXISTS
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class AddTagController extends Controller {
    const PATH = '/add-tag';
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

        if(!$user->canManageTicket($ticket)) throw new RequestException(ERRORS::NO_PERMISSION);

        if ($ticket->sharedTagList->includesId($tagId)) throw new RequestException(ERRORS::TAG_EXISTS);

        $ticket->sharedTagList->add($tag);
        $ticket->store();

        Response::respondSuccess();
    }
}
