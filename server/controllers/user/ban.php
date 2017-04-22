<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /user/ban Bans email users.
 *
 * @apiName BanUser
 *
 * @apiGroup User
 *
 * @apiDescription This path takes an Email and bans it.
 *
 * @apiPermission Staff Level 1
 * 
 * @apiParam {String} email Email of user to ban.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_EMAIL
 * @apiUse ALREADY_BANNED
 *
 * @apiSuccess {Object} data Empty object
 *
 */
class BanUserController extends Controller {
    const PATH = '/ban';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'email' => [
                    'validation' => DataValidator::email(),
                    'error' => ERRORS::INVALID_EMAIL
                ]
            ]
        ];
    }

    public function handler() {
        $email = Controller::request('email');

        $banRow = Ban::getDataStore($email,'email');
        if($banRow->isNull()) {
            $ban = new Ban();

            $ban->setProperties(array(
                'email' => $email
            ));

            $ban->store();

            Log::createLog('BAN_USER', $email);

            Response::respondSuccess();
        } else {
            Response::respondError(ERRORS::ALREADY_BANNED);
        }
    }
}