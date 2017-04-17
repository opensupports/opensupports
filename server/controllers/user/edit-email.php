<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /user/edit-email Edit email of an user.
 *
 * @apiName edit-email
 *
 * @apiGroup User
 *
 * @apiDescription This path change the email of a user.
 *
 * @apiPermission User
 *
 * @apiParam {string} newEmail The new email that the user wants to change.
 *
 * @apiError {String} message
 *
 * @apiSuccess {Object} data
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
        $user->email = $newEmail;
        $user->store();
        
        $mailSender = new MailSender();
        $mailSender->setTemplate('USER_EMAIL', [
            'to'=>$oldEmail,
            'newemail'=>$user->email,
            'name'=>$user->name
        ]);
        $mailSender->send();
        
        Response::respondSuccess();
    }
}