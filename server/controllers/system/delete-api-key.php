<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/delete-api-key Delete APIKey
 * @apiVersion 4.6.1
 *
 * @apiName Delete APIKey
 *
 * @apiGroup System
 *
 * @apiDescription This path deletes an APIKey.
 *
 * @apiPermission staff3
 *
 * @apiParam {String} name Name of the APIKey to delete.
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
                    'validation' => DataValidator::notBlank()->length(2, 55),
                    'error' => ERRORS::INVALID_NAME
                ]
            ]
        ];
    }

    public function handler() {
        $name = Controller::request('name');

        $keyInstance = APIKey::getDataStore($name, 'name');
        
        if($keyInstance->isNull()) {
            throw new RequestException(ERRORS::INVALID_NAME);
            return;
        }

        $keyInstance->delete();
        Response::respondSuccess();
    }
}