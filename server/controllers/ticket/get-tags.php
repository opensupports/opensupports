<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/get-tags Get tags
 * @apiVersion 4.4.0
 *
 * @apiName Get tags
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path returns all the tags.
 *
 * @apiPermission staff1
 *
 * @apiUse NO_PERMISSION
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class GetTagsController extends Controller {
    const PATH = '/get-tags';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => []
        ];
    }

    public function handler() {
        $tags = Tag::getAll();
        
        Response::respondSuccess($tags->toArray());
    }
}
