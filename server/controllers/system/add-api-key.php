<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/add-api-key Add APIKey
 * @apiVersion 4.11.0
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
 * @apiParam {Boolean} canCreateUsers canCreateUsers determinates if the apikey has the permission to create users 
 * @apiParam {Boolean} canCreateTickets canCreateTickets determinates if the apikey has the permission to create tickets
 * @apiParam {Boolean} canCheckTickets canCheckTickets determinates if the apikey has the permission to check tickets
 * @apiParam {Boolean} shouldReturnTicketNumber shouldReturnTicketNumber determinates if the apikey has the permission of returning ticket number after ticket creation
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_NAME
 * @apiUse NAME_ALREADY_USED
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
                    'validation' => DataValidator::notBlank()->length(LengthConfig::MIN_LENGTH_NAME, LengthConfig::MAX_LENGTH_NAME)->alnum(),
                    'error' => ERRORS::INVALID_NAME
                ]
            ]
        ];
    }

    public function handler() {
        $apiInstance = new APIKey();

        $name = Controller::request('name');
        $canCreateUsers = (bool)Controller::request('canCreateUsers');
        $canCreateTickets = (bool)Controller::request('canCreateTickets');
        $canCheckTickets = (bool)Controller::request('canCheckTickets');
        $shouldReturnTicketNumber = (bool)Controller::request('shouldReturnTicketNumber');
        $keyInstance = APIKey::getDataStore($name, 'name');

        if($keyInstance->isNull()){
            $token = Hashing::generateRandomToken();

            $apiInstance->setProperties([
                'name' => $name,
                'token' => $token,
                'canCreateUsers' => $canCreateUsers,
                'canCreateTickets' => $canCreateTickets,
                'canCheckTickets' => $canCheckTickets,
                'shouldReturnTicketNumber' => $shouldReturnTicketNumber
            ]);

            $apiInstance->store();
            Response::respondSuccess($token);
        } else {
            throw new RequestException(ERRORS::NAME_ALREADY_USED);
        }

    }
}