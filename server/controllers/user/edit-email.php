<?php
use Respect\Validation\Validator as DataValidator;

class EditEmail extends Controller{
    const PATH = '/edit-email';

    public function validations() {
        return [
            'permission' => 'user',
            'requestData' => [
                'newEmail' => [
                    'validation' => DataValidator::email(),
                    'error' => ERRORS::INVALID_EMAIL
                ]
            ]
        ];
    }
    
    public function handler() {
        $newEmail = Controller::request('newEmail');
        $user = Controller::getLoggedUser();
        $oldEmail = $user->email;
        $user->email = $newEmail;
        $user->store();
        
        $mailSender = new MailSender();
        $mailSender->setTemplate('USER_EDIT_EMAIL', [
            'to'=>$oldEmail,
            'newemail'=>$user->email,
            'name'=>$user->name
        ]);
        $mailSender->send();
        
        Response::respondSuccess();
    }
}