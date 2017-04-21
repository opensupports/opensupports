<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /user/send-recover-password Send a token to the email of the user to change his password
 *
 * @apiName Send recover password
 *
 * @apiGroup User
 *
 * @apiDescription This path send a token to the email of the user to change his password.
 *
 * @apiPermission Any
 *
 * @apiParam {String} email  The email of the user who forgot the password.
 *
 * @apiUse INVALID_EMAIL
 * @apiUse USER_SYSTEM_DISABLED
 * @apiUse INVALID_EMAIL
 *
 * @apiSuccess {Object} data Empty object.
 *
 */

class SendRecoverPasswordController extends Controller {
    const PATH = '/send-recover-password';
    const METHOD = 'POST';

    private $token;
    private $user;

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => [
                'email' => [
                    'validation' => DataValidator::email()->userEmail(),
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
        $this->user = User::getUser($email,'email');
        
        if(!$this->user->isNull()) {
            $this->token = Hashing::generateRandomToken();

            $recoverPassword = new RecoverPassword();
            $recoverPassword->setProperties(array(
                'email' => $email,
                'token' => $this->token
            ));
            $recoverPassword->store();

            $this->sendEmail();

            Response::respondSuccess();
        } else {
            Response::respondError(ERRORS::INVALID_EMAIL);
        }
        
    }

    public function sendEmail() {
        $mailSender = new MailSender();

        $mailSender->setTemplate(MailTemplate::PASSWORD_FORGOT, [
            'to' => $this->user->email,
            'name' => $this->user->name,
            'token' => $this->token
        ]);

        $mailSender->send();
    }
}
