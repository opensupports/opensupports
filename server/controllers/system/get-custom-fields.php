<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/get-custom-fields Get custom fields
 * @apiVersion 4.6.1
 *
 * @apiName Get all Custom field items
 *
 * @apiGroup System
 *
 * @apiDescription This path retrieves the all CustomField items.
 *
 * @apiPermission any
 *
 * @apiUse NO_PERMISSION
 *
 * @apiSuccess {[Customfield](#api-Data_Structures-ObjectCustomfield)[]} data Array of Customfield
 *
 */

class GetCustomFieldsController extends Controller {
    const PATH = '/get-custom-fields';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => []
        ];
    }

    public function handler() {
        $customFieldList = Customfield::getAll();

        Response::respondSuccess($customFieldList->toArray());
    }
}
