<?php

class SignUpController extends Controller {
    const PATH = '/signup';
    
    private $userEmail;
    private $userPassword;

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => []
        ];
    }

    public function handler() {
        $this->setRequestData();

        try {
            $userId = $this->createNewUserAndRetrieveId();
            $this->sendRegistrationMail();

            Response::respondSuccess([
                'userId' => $userId,
                'userEmail' => $this->userEmail
            ]);
        } catch (Exception $e) {
            Response::respondError($e->getMessage());
        }

    }
    
    public function setRequestData() {
        $this->userEmail = Controller::request('email');
        $this->userPassword = Controller::request('password');
    }

    public function createNewUserAndRetrieveId() {
        $userInstance = new User();
        
        $userInstance->setProperties([
            'email' => $this->userEmail,
            'password' => Hashing::hashPassword($this->userPassword)
        ]);

        return $userInstance->store();
    }
    
    public function sendRegistrationMail() {
        $mailSender = new MailSender();
        
        $mailSender->setTemplate(MailTemplate::USER_SIGNUP, [
            'to' => $this->userEmail
        ]);
        
        $mailSender->send();
    }
}
