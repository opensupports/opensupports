<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /user/enable Ban email
 * @apiVersion 4.6.1
 *
 * @apiName Enable User
 *
 * @apiGroup User
 *
 * @apiDescription This path takes an user id and enables it
 *
 * @apiPermission staff1
 *
 * @apiParam {String} userId Id of the user to enable
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_USER
 * @apiUse ALREADY_ENABLED
 *
 * @apiSuccess {Object} data Empty object
 *
 */
class EnableUserController extends Controller {
    const PATH = '/enable';
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
        $user = User::getDataStore(Controller::request('userId'));

        if(!$user->disabled) {
            throw new RequestException(ERRORS::ALREADY_ENABLED);
        }

        $user->disabled = 0;
        $user->store();

        Response::respondSuccess();
    }
}
