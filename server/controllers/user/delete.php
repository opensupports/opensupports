<?php
use Respect\Validation\Validator as DataValidator;
use RedBeanPHP\Facade as RedBean;

/**
 * @api {post} /user/delete Delete a user.
 *
 * @apiName delete
 *
 * @apiGroup User
 *
 * @apiDescription This path receive a user id and delete its user.
 *
 * @apiPermission Staff level 1
 *
 * @apiParam {number} userId The id of the user to delete.
 *
 * @apiError {String} message
 *
 * @apiSuccess {Object} data
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
            throw new Exception(ERRORS::USER_SYSTEM_DISABLED);
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