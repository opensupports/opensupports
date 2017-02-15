<?php
use Respect\Validation\Validator as DataValidator;

class DeleteAPIKeyController extends Controller {
    const PATH = '/delete-api-key';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'name' => [
                    'validation' => DataValidator::length(2, 55)->alpha(),
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