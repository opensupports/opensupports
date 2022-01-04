<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/** 
* @api {post} /user/resend-email-token Resend user sign up token
* @apiVersion 4.11.0
*
* @apiName Resend user sign up token
*
* @apiGroup User
*
* @apiDescription This path resends token to signed up user.
*
* @apiPermission user
*
* @apiParam {email} email email of the signed up user.
*
* @apiUse NO_PERMISSION
* @apiUse INVALID_EMAIL
*
* @apiSuccess {Object} data Empty object
*
*/

class ResendEmailTokenController extends Controller {
    const PATH = '/resend-email-token';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'any',
            'requestData' => [
                'email' => [
                    'validation' => DataValidator::email(),
                    'error' => ERRORS::INVALID_EMAIL
                ]
            ]
        ];
    }

    public function handler() {
        $userEmail = Controller::request('email');

        $user = User::getDataStore($userEmail, 'email');
        
        if (!$user->verificationToken || !$user->email) {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        if(MailSender::getInstance()->isConnected()) {
            $this->resendTokenMail($user);
        }
        
        Response::respondSuccess();
    }

    public function resendTokenMail($user) {
        $mailSender = MailSender::getInstance();
    
        $mailSender->setTemplate(MailTemplate::USER_SIGNUP, [
            'to' => $user->email,
            'name' => $user->name,
            'url' => Setting::getSetting('url')->getValue(),
            'verificationToken' => $user->verificationToken
        ]);

        $mailSender->send();
    }
}
