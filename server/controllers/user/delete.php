<?php
use Respect\Validation\Validator as DataValidator;
use RedBeanPHP\Facade as RedBean;

/**
 * @api {post} /user/delete Delete user
 * @apiVersion 4.6.1
 *
 * @apiName Delete user
 *
 * @apiGroup User
 *
 * @apiDescription This path receives an user id and deletes the user.
 *
 * @apiPermission staff1
 *
 * @apiParam {Number} userId The id of the user to delete.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_USER
 * @apiUse USER_SYSTEM_DISABLED
 *
 * @apiSuccess {Object} data Empty object
 *
 */

DataValidator::with('CustomValidations', true);

class DeleteUserController extends Controller {
    const PATH = '/delete';
    const METHOD = 'POST';

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
        if(!Controller::isUserSystemEnabled()) {
            throw new RequestException(ERRORS::USER_SYSTEM_DISABLED);
        }
        
        $userId = Controller::request('userId');
        $user = User::getDataStore($userId);

        Log::createLog('DELETE_USER', $user->name);
        RedBean::exec('DELETE FROM log WHERE author_user_id = ?', [$userId]);
        
        foreach($user->sharedTicketList as $ticket) {
            $ticket->delete();
        }

        $user->delete();

        Response::respondSuccess();
    }
}