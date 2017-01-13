<?php
use Respect\Validation\Validator as DataValidator;

class AddAPIKeyController extends Controller {
    const PATH = '/add-api-key';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'name' => [
                    'validation' => DataValidator::length(2, 55)->alnum(),
                    'error' => ERRORS::INVALID_NAME
                ]
            ]
        ];
    }

    public function handler() {
        $apiInstance = new APIKey();

        $name = Controller::request('name');

        $keyInstance = APIKey::getDataStore($name, 'name');

        if($keyInstance->isNull()){
            $token = Hashing::generateRandomToken();

            $apiInstance->setProperties([
                'name' => $name,
                'token' => $token
            ]);

            $apiInstance->store();
            Response::respondSuccess($token);
        } else {
            Response::respondError(ERRORS::NAME_ALREADY_USED);
        }

    }
}