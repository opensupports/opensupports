<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/delete-api-key Delete APIKey
 * @apiVersion 4.11.0
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
                    'validation' => DataValidator::notBlank()->length(LengthConfig::MIN_LENGTH_NAME, LengthConfig::MAX_LENGTH_NAME),
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