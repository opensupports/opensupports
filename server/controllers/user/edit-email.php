<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /user/edit-email Edit email
 * @apiVersion 4.11.0
 *
 * @apiName Edit email
 *
 * @apiGroup User
 *
 * @apiDescription This path changes the email of an user.
 *
 * @apiPermission user
 *
 * @apiParam {String} newEmail The new email that the user wants to change.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_EMAIL
 * 
 * @apiSuccess {Object} data Empty object
 *
 */

class EditEmail extends Controller{
    const PATH = '/edit-email';
    const METHOD = 'POST';

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

        $this->verifyEmail($newEmail, $user);

        $user->email = $newEmail;
        
        $user->store();
        
        $mailSender = MailSender::getInstance();
        $mailSender->setTemplate('USER_EMAIL', [
            'to'=>$oldEmail,
            'newemail'=>$user->email,
            'name'=>$user->name
        ]);
        $mailSender->send();
        
        Response::respondSuccess();
    }

    private function verifyEmail($email, $logedUser){

        $staff = Staff::getDataStore($email,'email');
        $user = User::getDataStore($email,'email');
        
        if($user->email == $email && $logedUser->email != $email){
            throw new RequestException(ERRORS::INVALID_EMAIL);
        }

        if($staff->email == $email){
            throw new RequestException(ERRORS::INVALID_EMAIL);
        }
    }
}