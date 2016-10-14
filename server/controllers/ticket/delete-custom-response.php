<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class DeleteCustomResponseController extends Controller {
    const PATH = '/delete-custom-response';

    public function validations() {
        return [
            'permission' => 'staff_2',
            'requestData' => [
                'id' => [
                    'validation' => DataValidator::dataStoreId('customresponse'),
                    'error' => ERRORS::INVALID_NAME
                ]
            ]
        ];
    }

    public function handler() {
        $customResponse = CustomResponse::getDataStore(Controller::request('id'));
        $customResponse->trash();

        Response::respondSuccess();
    }
}