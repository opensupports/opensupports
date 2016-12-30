<?php
use Respect\Validation\Validator as DataValidator;
use RedBeanPHP\Facade as RedBean;

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
        RedBean::exec('DELETE FROM log WHERE author_user_id = ?', [$userId]);
        $user->delete();

        Response::respondSuccess();
    }
}