<?php

use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class SignUpController extends Controller {
    const PATH = '/signup';
    
    private $userEmail;
    private $userName;
    private $userPassword;

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => [
                'name' => [
                    'validation' => DataValidator::length(2, 55)->alpha(),
                    'error' => ERRORS::INVALID_NAME
                ],
                'email' => [
                    'validation' => DataValidator::email(),
                    'error' => ERRORS::INVALID_EMAIL
                ],
                'password' => [
                    'validation' => DataValidator::length(5, 200),
                    'error' => ERRORS::INVALID_PASSWORD
                ],
                'captcha' => [
                    'validation' => DataValidator::captcha(),
                    'error' => ERRORS::INVALID_CAPTCHA
                ]
            ]
        ];
    }

    public function handler() {
        $this->storeRequestData();

        $existentUser = User::getUser($this->userEmail, 'email');

        if (!$existentUser->isNull()) {
            Response::respondError(ERRORS::USER_EXISTS);
            return;
        }

        $userId = $this->createNewUserAndRetrieveId();
        $this->sendRegistrationMail();

        Response::respondSuccess([
            'userId' => $userId,
            'userEmail' => $this->userEmail
        ]);

    }
    
    public function storeRequestData() {
        $this->userName = Controller::request('name');
        $this->userEmail = Controller::request('email');
        $this->userPassword = Controller::request('password');
    }

    public function createNewUserAndRetrieveId() {
        $userInstance = new User();
        
        $userInstance->setProperties([
            'name' => $this->userName,
            'email' => $this->userEmail,
            'password' => Hashing::hashPassword($this->userPassword)
        ]);

        return $userInstance->store();
    }
    
    public function sendRegistrationMail() {
        $mailSender = new MailSender();
        
        $mailSender->setTemplate(MailTemplate::USER_SIGNUP, [
            'to' => $this->userEmail,
            'name' => $this->userName
        ]);
        
        $mailSender->send();
    }
}
