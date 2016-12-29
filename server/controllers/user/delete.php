<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class DeleteUserController extends Controller {
    const PATH = '/delete';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'userId' => [
                    'validation' => DataValidator::dataStoreId('user'),
                    'error' => ERRORS::INVALID_USER
                ]
            ]
        ];
    }

    public function handler() {
        $userId = Controller::request('userId');
        $user = User::getDataStore($userId);

        Log::createLog('DELETE_USER', $user->name);

        $user->delete();

        Response::respondSuccess();
    }
}