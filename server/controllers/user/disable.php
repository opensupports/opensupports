<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /user/disable Ban email
 * @apiVersion 4.6.1
 *
 * @apiName Disable User
 *
 * @apiGroup User
 *
 * @apiDescription This path takes an user id and disabled access for it
 *
 * @apiPermission staff1
 *
 * @apiParam {String} userId Id of the user to disable
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_USER
 * @apiUse ALREADY_DISABLED
 *
 * @apiSuccess {Object} data Empty object
 *
 */
class DisableUserController extends Controller {
    const PATH = '/disable';
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
        if($user->disabled) {
            throw new RequestException(ERRORS::ALREADY_DISABLED);
        }

        $user->disabled = 1;
        $user->store();

        Response::respondSuccess();
    }
}
