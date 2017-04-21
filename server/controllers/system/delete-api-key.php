<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/delete-api-key Delete a api-key.
 *
 * @apiName Delete api-key
 *
 * @apiGroup system
 *
 * @apiDescription This path delete a api-key.
 *
 * @apiPermission Staff level 3
 *
 * @apiParam {String} name Name of the api-key to delete.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_NAME
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class DeleteAPIKeyController extends Controller {
    const PATH = '/delete-api-key';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'name' => [
                    'validation' => DataValidator::length(2, 55),
                    'error' => ERRORS::INVALID_NAME
                ]
            ]
        ];
    }

    public function handler() {
        $name = Controller::request('name');

        $keyInstance = APIKey::getDataStore($name, 'name');
        
        if($keyInstance->isNull()) {
            Response::respondError(ERRORS::INVALID_NAME);
            return;
        }

        $keyInstance->delete();
        Response::respondSuccess();
    }
}