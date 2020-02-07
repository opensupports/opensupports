<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /user/send-recover-password Send password recovery
 * @apiVersion 4.6.1
 *
 * @apiName Send password recovery
 *
 * @apiGroup User
 *
 * @apiDescription This path sends a token to the email of the user/staff to change his password.
 *
 * @apiPermission any
 *
 * @apiParam {String} email The email of the user/staff who forgot the password.
 * @apiParam {Boolean} staff Indicates if the user is a staff member.
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
    private $staff;

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
                ]
            ]
        ];
    }

    public function handler() {
        $this->staff = Controller::request('staff');

        if(!Controller::isUserSystemEnabled() && !$this->staff) {
            throw new RequestException(ERRORS::USER_SYSTEM_DISABLED);
        }

        $email = Controller::request('email');

        if($this->staff){
            $this->user = Staff::getUser($email, 'email');
        } else {
            $this->user = User::getUser($email, 'email');
        }

        if(!$this->user->isNull()) {
            $this->token = Hashing::generateRandomToken();

            $recoverPassword = new RecoverPassword();
            $recoverPassword->setProperties(array(
                'email' => $email,
                'token' => $this->token,
                'staff' => !!$this->staff
            ));
            $recoverPassword->store();

            $this->sendEmail();

            Response::respondSuccess();
        } else {
            throw new RequestException(ERRORS::INVALID_EMAIL);
        }
    }

    public function sendEmail() {
        $mailSender = MailSender::getInstance();

        $mailSender->setTemplate(MailTemplate::PASSWORD_FORGOT, [
            'to' => $this->user->email,
            'name' => $this->user->name,
            'url' => Setting::getSetting('url')->getValue(),
            'token' => $this->token
        ]);

        $mailSender->send();
    }
}
