<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /user/edit-password Edit password
 * @apiVersion 4.6.1
 *
 * @apiName Edit password
 *
 * @apiGroup User
 *
 * @apiDescription This path edits the password of an user.
 *
 * @apiPermission user
 *
 * @apiParam {String} newPassword The new password that the user wants to change.
 * @apiParam {String} oldPassword The actual password of the user.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_PASSWORD
 * @apiUse INVALID_OLD_PASSWORD
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class EditPassword extends Controller {
    const PATH = '/edit-password';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'user',
            'requestData' => [
                'newPassword' => [
                    'validation' => DataValidator::notBlank()->length(5, 200),
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

            $mailSender = MailSender::getInstance();
            $mailSender->setTemplate('USER_PASSWORD', [
                'to'=>$user->email,
                'name'=>$user->name
            ]);
            $mailSender->send();
            
            Response::respondSuccess();
        } else{
            throw new RequestException(ERRORS::INVALID_OLD_PASSWORD);
        }
    }
}