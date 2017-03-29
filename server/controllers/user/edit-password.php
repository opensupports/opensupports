<?php
use Respect\Validation\Validator as DataValidator;

class EditPassword extends Controller {
    const PATH = '/edit-password';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'user',
            'requestData' => [
                'newPassword' => [
                    'validation' => DataValidator::length(5, 200),
                    'error' => ERRORS::INVALID_PASSWORD
                ]
            ]
        ];
    }

    public function handler() {
        $oldPassword = Controller::request('oldPassword');
        $newPassword = Controller::request('newPassword');
        $user = Controller::getLoggedUser() ;

        if (Hashing::verifyPassword($oldPassword, $user->password)) {
            $user->password = Hashing::hashPassword($newPassword);
            $user->store();

            $mailSender = new MailSender();
            $mailSender->setTemplate('USER_PASSWORD', [
                'to'=>$user->email,
                'name'=>$user->name
            ]);
            $mailSender->send();
            
            Response::respondSuccess();
        } else{
            Response::respondError(ERRORS::INVALID_OLD_PASSWORD);
        }
    }
}