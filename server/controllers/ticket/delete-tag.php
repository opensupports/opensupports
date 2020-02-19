<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/delete-tag Delete a tag
 * @apiVersion 4.6.1
 *
 * @apiName Delete tag
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path delete a tag.
 *
 * @apiPermission staff3
 *
 * @apiParam {Number} tagId The id of the tag.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TAG
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class DeleteTagController extends Controller {
    const PATH = '/delete-tag';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'tagId' => [
                    'validation' => DataValidator::dataStoreId('tag'),
                    'error' => ERRORS::INVALID_TAG
                ]
            ]
        ];
    }

    public function handler() {

        $tagInstance = Tag::getDataStore(Controller::request('tagId'));

        $tagInstance->delete();

        Response::respondSuccess();
    }
}
