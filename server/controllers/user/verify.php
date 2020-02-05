<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /user/verify Verify email
 * @apiVersion 4.6.1
 *
 * @apiName Verify email
 *
 * @apiGroup User
 *
 * @apiDescription This path verifies the email of a new user.
 *
 * @apiPermission any
 *
 * @apiParam {String} email  The email of the user.
 * @apiParam {String} token The validation token sent by email to the user.
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
            throw new RequestException(ERRORS::USER_SYSTEM_DISABLED);
        }

        $email = Controller::request('email');
        $token = Controller::request('token');

        $userRow = User::getDataStore($email, 'email');

        if(!$userRow) {
            throw new RequestException(ERRORS::INVALID_EMAIL);
        }

        if($userRow->verificationToken !== $token) {
            throw new RequestException(ERRORS::INVALID_TOKEN);
        }

        $userRow->verificationToken = null;
        $userRow->store();

        Response::respondSuccess();
    }
}
