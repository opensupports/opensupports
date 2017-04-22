<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /user/verify Verify the email of a new user.
 *
 * @apiName Verify
 *
 * @apiGroup User
 *
 * @apiDescription This path verify the email of a new user.
 *
 * @apiPermission any
 *
 * @apiParam {String} email  The email of the user.
 * @apiParam {String} token The key of validation the user.
 *
 * @apiUse INVALID_EMAIL
 * @apiUse USER_SYSTEM_DISABLED
 * @apiUse INVALID_TOKEN
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class VerifyController extends Controller{
    const PATH = '/verify';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => [
                'email' => [
                    'validation' => DataValidator::email(),
                    'error' => ERRORS::INVALID_EMAIL
                ]
            ]
        ];
    }

    public function handler() {
        if(!Controller::isUserSystemEnabled()) {
            throw new Exception(ERRORS::USER_SYSTEM_DISABLED);
        }
        
        $email = Controller::request('email');
        $token = Controller::request('token');

        $userRow = User::getDataStore($email, 'email');

        if(!$userRow) {
            Response::respondError(ERRORS::INVALID_EMAIL);
            return;
        }
        if($userRow->verificationToken !== $token) {
            Response::respondError(ERRORS::INVALID_TOKEN);
            return;
        }
        $userRow->verificationToken = null;
        $userRow->store();
        
        Response::respondSuccess();
    }
}