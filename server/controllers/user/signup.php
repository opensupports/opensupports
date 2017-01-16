<?php

use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

class SignUpController extends Controller {
    const PATH = '/signup';
    
    private $userEmail;
    private $userName;
    private $userPassword;
    private $verificationToken;

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
        if(!Controller::isUserSystemEnabled()) {
            throw new Exception(ERRORS::USER_SYSTEM_DISABLED);
        }
        
        $this->storeRequestData();

        $existentUser = User::getUser($this->userEmail, 'email');

        if (!$existentUser->isNull()) {
            Response::respondError(ERRORS::USER_EXISTS);
            return;
        }
        $banRow = Ban::getDataStore($this->userEmail,'email');

        if (!$banRow->isNull()) {
            Response::respondError(ERRORS::ALREADY_BANNED);
            return;
        }

        if (!Setting::getSetting('registration')->value) {
            Response::respondError(ERRORS::NO_PERMISSION);
            return;
        }

        $userId = $this->createNewUserAndRetrieveId();
        $this->sendRegistrationMail();

        Response::respondSuccess([
            'userId' => $userId,
            'userEmail' => $this->userEmail
        ]);
        
        Log::createLog('SIGNUP', null, User::getDataStore($userId));
    }
    
    public function storeRequestData() {
        $this->userName = Controller::request('name');
        $this->userEmail = Controller::request('email');
        $this->userPassword = Controller::request('password');
        $this->verificationToken = Hashing::generateRandomToken();
    }

    public function createNewUserAndRetrieveId() {
        $userInstance = new User();

        $userInstance->setProperties([
            'name' => $this->userName,
            'signupDate' => Date::getCurrentDate(),
            'tickets' => 0,
            'email' => $this->userEmail,
            'password' => Hashing::hashPassword($this->userPassword),
            'verificationToken' => $this->verificationToken
        ]);

        return $userInstance->store();
    }
    
    public function sendRegistrationMail() {
        $mailSender = new MailSender();
        
        $mailSender->setTemplate(MailTemplate::USER_SIGNUP, [
            'to' => $this->userEmail,
            'name' => $this->userName,
            'verificationToken' => $this->verificationToken
        ]);
        
        $mailSender->send();
    }
}
