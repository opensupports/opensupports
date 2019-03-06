<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/edit-tag Edit tag
 * @apiVersion 4.4.0
 *
 * @apiName Edit tag
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path edit tags.
 *
 * @apiPermission staff1
 *
 * @apiParam {Number} tagId The id of the tag.
 * @apiParam {Number} name The new name of the tag.
 * @apiParam {String} color The new color of the tag.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TAG
 * @apiUse TAG_EXISTS
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class EditTagController extends Controller {
    const PATH = '/edit-tag';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'tagId' => [
                    'validation' => DataValidator::dataStoreId('tag'),
                    'error' => ERRORS::INVALID_TAG
                ]
            ]
        ];
    }

    public function handler() {
        $name = Controller::request('name');
        $color = Controller::request('color');
        $tagInstance = Tag::getDataStore(Controller::request('tagId'));

        if($name) $tagInstance->name = $name;
        if($color) $tagInstance->color = $color;

        $newNameTagInstance = Tag::getDataStore($name, 'name');
        if (!$newNameTagInstance ->isNull() && $newNameTagInstance->id !== $tagInstance->id) {
            throw new RequestException(ERRORS::TAG_EXISTS);
        }

        $tagInstance->store();

        Response::respondSuccess();
    }
}
