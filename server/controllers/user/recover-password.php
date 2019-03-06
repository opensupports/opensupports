<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /user/recover-password Recover password
 * @apiVersion 4.4.0
 *
 * @apiName Recover password
 *
 * @apiGroup User
 *
 * @apiDescription This path changes the password of the user using a token sent by the email.
 *
 * @apiPermission any
 *
 * @apiParam {String} email  The email of the user who forgot the password.
 * @apiParam {String} password The new password of the user.
 * @apiParam {String} token  The token sent by email to the user.
 *
 * @apiUse INVALID_EMAIL
 * @apiUse INVALID_PASSWORD
 * @apiUse USER_SYSTEM_DISABLED
 * @apiUse NO_PERMISSION
 *
 * @apiSuccess {Object} data Empty object
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
                    'validation' => DataValidator::oneOf(
                        DataValidator::email()->userEmail(),
                        DataValidator::email()->staffEmail()
                    ),
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
            throw new RequestException(ERRORS::USER_SYSTEM_DISABLED);
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

        if($recoverPassword->staff) {
            $this->user = Staff::getDataStore($this->email, 'email');
        }else {
            $this->user = User::getDataStore($this->email, 'email');
        }

        if (!$recoverPassword->isNull() && !$this->user->isNull()) {
            $recoverPassword->delete();

            $this->user->setProperties([
                'password' => Hashing::hashPassword($this->password)
            ]);

            $this->user->store();

            $this->sendMail();
            Response::respondSuccess(['staff' => $recoverPassword->staff]);
        } else {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }
    }
    public function sendMail() {
        $mailSender = MailSender::getInstance();

        $mailSender->setTemplate(MailTemplate::USER_PASSWORD, [
            'to' => $this->user->email,
            'url' => Setting::getSetting('url')->getValue(),
            'name' => $this->user->name
        ]);

        $mailSender->send();
    }
}
