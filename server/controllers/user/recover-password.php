<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /user/recover-password Change the password of the user using a token sended from the email.
 *
 * @apiName recover password
 *
 * @apiGroup User
 *
 * @apiDescription This path change the password of the user usign a token sended from the email.
 *
 * @apiPermission Any
 *
 * @apiParam {string} email  The email of the user who forgot the password.
 *
 * @apiParam {string} password The new password of the user.
 *
 * @apiParam {string} token  The token that was sended to the email of the user.
 *
 * @apiError {String} message
 *
 * @apiSuccess {Object} data
 *
 */

class RecoverPasswordController extends Controller {
    const PATH = '/recover-password';
    const METHOD = 'POST';

    private $email;
    private $token;
    private $password;
    private $user;

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => [
                'email' => [
                    'validation' => DataValidator::email()->userEmail(),
                    'error' => ERRORS::INVALID_EMAIL
                ],
                'password' => [
                    'validation' => DataValidator::length(5, 200),
                    'error' => ERRORS::INVALID_PASSWORD
                ]
            ]
        ];
    }

    public function handler() {
        if(!Controller::isUserSystemEnabled()) {
            throw new Exception(ERRORS::USER_SYSTEM_DISABLED);
        }
        
        $this->requestData();
        $this->changePassword();
    }

    public function requestData() {
        $this->email = Controller::request('email');
        $this->token = Controller::request('token');
        $this->password = Controller::request('password');
    }
    public function changePassword() {
        $recoverPassword = RecoverPassword::getDataStore($this->token, 'token');
        $this->user = User::getDataStore($this->email, 'email');

        if (!$recoverPassword->isNull() && !$this->user->isNull()) {
            $recoverPassword->delete();

            $this->user->setProperties([
                'password' => Hashing::hashPassword($this->password)
            ]);

            $this->user->store();

            $this->sendMail();
            Response::respondSuccess();
        } else {
            Response::respondError(ERRORS::NO_PERMISSION);
        }
    }
    public function sendMail() {
        $mailSender = new MailSender();

        $mailSender->setTemplate(MailTemplate::USER_PASSWORD, [
            'to' => $this->user->email,
            'name' => $this->user->name,
        ]);

        $mailSender->send();
    }
}
