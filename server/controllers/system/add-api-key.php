<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/add-api-key Add APIKey
 * @apiVersion 4.6.1
 *
 * @apiName Add APIKey
 *
 * @apiGroup System
 *
 * @apiDescription This path creates a new APIKey.
 *
 * @apiPermission staff3
 *
 * @apiParam {String} name Name of the new APIKey.
 * @apiParam {String} type Type of APIKey: "REGISTRATION" or "TICKET_CREATE"
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_NAME
 * @apiUse NAME_ALREADY_USED
 * @apiUse INVALID_API_KEY_TYPE
 *
 * @apiSuccess {String} data Token of the APIKey.
 *
 */

class AddAPIKeyController extends Controller {
    const PATH = '/add-api-key';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'name' => [
                    'validation' => DataValidator::notBlank()->length(2, 55)->alnum(),
                    'error' => ERRORS::INVALID_NAME
                ],
                'type' => [
                    'validation' => DataValidator::in(APIKey::TYPES),
                    'error' => ERRORS::INVALID_API_KEY_TYPE
                ]
            ]
        ];
    }

    public function handler() {
        $apiInstance = new APIKey();

        $name = Controller::request('name');
        $type = Controller::request('type');

        $keyInstance = APIKey::getDataStore($name, 'name');

        if($keyInstance->isNull()){
            $token = Hashing::generateRandomToken();

            $apiInstance->setProperties([
                'name' => $name,
                'token' => $token,
                'type' => $type,
            ]);

            $apiInstance->store();
            Response::respondSuccess($token);
        } else {
            throw new RequestException(ERRORS::NAME_ALREADY_USED);
        }

    }
}