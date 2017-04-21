<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

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
            'url' => Setting::getSetting('url')->getValue(),
            'name' => $this->user->name
        ]);

        $mailSender->send();
    }
}
